from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import joblib
from datetime import datetime,timezone
from collections import defaultdict
import logging
from functools import wraps
import json
from ip2geotools.databases.noncommercial import DbIpCity

app = Flask(__name__, static_folder='../../client/soybean2/build', static_url_path='')

CORS(app, resources={r"/api/*": {"origins": ["http://3.16.192.151:5173", "http://localhost:5173", "http://127.0.0.1:5173"]}})

# Configuration
MAX_YIELD = 125
MIN_YIELD = 15
MODEL_PATHS = {
    "N. Piedmont": "models/North_Coastal_Plain_model_pipeline.pkl",
    "Tidewater": "models/Tidewater_model_pipeline.pkl",
    "N. Coastal Plain": "models/North_Coastal_Plain_model_pipeline.pkl",
    "S. Piedmont": "models/South_Piedmont_model_pipeline.pkl",
    "S. Coastal Plain": "models/South_Coastal_Plain_model_pipeline.pkl"
}
# Global state
current_model = None
processed_data = None
preloaded_models = {}

user_visits = []

# Set up logging
logging.basicConfig(level=logging.INFO)

# Error handling decorator
def errorHandler(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logging.exception(f"Unexpected error in {func.__name__}: {e}")
            return jsonify(error="Unexpected error occurred"), 500
    return wrapper

# Helper functions
def day_num_to_date(day_num):
    return datetime.strptime(f"2024-{int(day_num)}", "%Y-%j").strftime("%m/%d/%Y")

def generate_plot_data(x_values, y_values, optimal_point,x_range=None):
    layout = {
        "yaxis": {"range": [min(y_values)-5, max(y_values)+5]},
        "showlegend": True
    }
    if x_range is not None:
        layout["xaxis"] = {
            "range": x_range,
            "type": "linear"  # Explicitly set axis type to linear
        }
    return {
        "data": [
            {
                "x": x_values,
                "y": y_values,
                "type": "scatter",
                "mode": "lines+markers",
                "name": "Yield Index"
            },
            {
                "x": [optimal_point[0]],
                "y": [optimal_point[1]],
                "mode": "markers",
                "marker": {"color": "red", "size": 10},
                "name": "Optimal Point"
            }
        ],
        "layout": layout
    }

def preload_models():
    #Load all models and store them in the preloaded_models dict

    for region,model_path in MODEL_PATHS.items():
        try:
            with open(model_path,'rb') as f:
                preloaded_models[region]=joblib.load(f)
            print(f"Preloaded model for region {region}")
        except Exception as e:
            print(f"Error preloading model for region {region}: {e}")

@app.before_request
def initialize():
    #Preload all models
    preload_models()

# Routes
@app.route("/", methods=['GET'])
@errorHandler
def index():
    return jsonify(message="Welcome to the Flask backend! Add /home to see more.")

@app.route("/home", methods=['GET'])
@errorHandler
def home():
    return jsonify(message="Hello from the optimized Flask backend!")

# Track user visits
@app.route("/api/track_visit", methods=['POST'])
@errorHandler
def track_user_visit():
    ip = request.remote_addr  # Getting user IP
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    try:
        response = DbIpCity.get(ip)  
        location = f"{response.city}, {response.region}, {response.country}"
    except Exception as e:
        logging.error(f"Geolocation API failure for IP {ip}: {e}")
        location = "Unknown"

    visit_data = {
        "ip": ip,
        "location": location,
        "timestamp": timestamp
    }
    user_visits.append(visit_data)  
    
    return jsonify(message="Visit logged successfully")

# Get all visits
@app.route("/api/get_visits", methods=["GET"])
@errorHandler
def get_visits():
    return jsonify(visits=user_visits) 

@app.route('/api/select_region', methods=['POST'])
@errorHandler
def select_region():
    global current_model, processed_data
    data = request.json
    region = data.get('region', '').strip()

    if not region or region not in MODEL_PATHS:
        return jsonify(error="Invalid region specified"), 400

    current_model = preloaded_models.get(region)
    if current_model is None:
        return jsonify(error= "Invalid region specified"),500

    # Generate parameter space
    planting_dates = np.arange(92, 213)  # April 1 to July 31
    maturity_groups = np.arange(2.0, 8.1, 0.1)
    seeding_rates = np.arange(75000, 180000, 5000)
    
    # Create parameter grid
    params = np.array(np.meshgrid(planting_dates, maturity_groups, seeding_rates)).T.reshape(-1, 3)
    predictions = current_model.predict(params)
        
    # Process predictions
    grouped = defaultdict(list)
    for row, pred in zip(params, predictions):
        key = (row[0], round(row[1], 1))  # (planting_date, maturity_group)
        grouped[key].append(pred[0])
        
    # Calculate means and normalize
    processed = []
    for (pd, mg), yields in grouped.items():
        y_mean = np.clip(np.mean(yields), MIN_YIELD, MAX_YIELD)
        processed.append([pd, mg, y_mean])
        
    processed = np.array(processed)
    y_min, y_max = processed[:, 2].min(), processed[:, 2].max()
    processed = np.column_stack((processed, ((processed[:, 2] - y_min) / (y_max - y_min)) * 100))
        
    processed_data = processed
    return jsonify(message=f"{region} model loaded successfully")
        

@app.route('/api/pd_optimiser', methods=['POST'])
@errorHandler
def pd_optimiser():
    global processed_data
    data = request.json
    start_day = datetime.strptime(data['start_date'], '%Y-%m-%d').timetuple().tm_yday
    end_day = datetime.strptime(data['end_date'], '%Y-%m-%d').timetuple().tm_yday
    mg_min = float(data.get('mg_min', 2.0))
    mg_max = float(data.get('mg_max', 8.0))

    # Filter data
    mask = (processed_data[:, 0] >= start_day) & (processed_data[:, 0] <= end_day) & \
            (processed_data[:, 1] >= mg_min) & (processed_data[:, 1] <= mg_max)
    filtered = processed_data[mask]

    # Group by planting date
    date_groups = defaultdict(list)
    for row in filtered:
        date_groups[row[0]].append(row[3])  # Yield Index

    dates, averages = zip(*[(k, np.mean(v)) for k, v in date_groups.items()])
    optimal_idx = np.argmax(averages)
        
    # Generate plot data
    date_labels = [day_num_to_date(d) for d in dates]
    plot_data = generate_plot_data(
            x_values=date_labels,
            y_values=averages,
            optimal_point=(date_labels[optimal_idx], averages[optimal_idx])
    )

    return jsonify({
        "plot": plot_data,
        "optimal_date": datetime.strptime(date_labels[optimal_idx], "%m/%d/%Y").strftime("%d %B %Y")
    })


@app.route('/api/mg_optimiser', methods=['POST'])
@errorHandler
def mg_optimiser():
    global processed_data

    data = request.json
    start_day = datetime.strptime(data['start_date'], '%Y-%m-%d').timetuple().tm_yday
    end_day = datetime.strptime(data['end_date'], '%Y-%m-%d').timetuple().tm_yday
    mg_min = float(data.get('mg_min', 2.0))
    mg_max = float(data.get('mg_max', 8.0))

    # Filter data
    mask = (processed_data[:, 0] >= start_day) & (processed_data[:, 0] <= end_day) & \
            (processed_data[:, 1] >= mg_min) & (processed_data[:, 1] <= mg_max)
    filtered = processed_data[mask]

    # Group by maturity group
    mg_groups = defaultdict(list)
    for row in filtered:
        mg = round(row[1], 1)
        mg_groups[mg].append(row[3])  # Yield Index

    mgs, averages = zip(*[(k, np.mean(v)) for k, v in mg_groups.items()])
    optimal_idx = np.argmax(averages)
        
    # Generate plot data
    plot_data = generate_plot_data(
        # x_values=[f"{mg:.1f}" for mg in mgs],
        x_values=mgs,
        y_values=averages,
        optimal_point=(f"{mgs[optimal_idx]:.1f}", averages[optimal_idx]),
        x_range=[mg_min,mg_max]
    )

    return jsonify({
        "plot": plot_data,
        "optimal_mg": f"{mgs[optimal_idx]:.1f}"
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
