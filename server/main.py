from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import pandas as pd
import joblib
from datetime import datetime
import plotly.express as px

app = Flask(__name__)
cors = CORS(app,origins='*')

#hyper-parameters
MAX_YIELD = 125
MIN_YIELD = 15
MAX_DATA = np.array([228, 8, 175000, 36.388502, -76.123188])
MIN_DATA = np.array([72, 2, 75000, 34.683317, -80.72672])

current_model = None 
new_df = None

model_dict = {
    "N. Piedmont": "models/North_Coastal_Plain_model_pipeline.pkl",
    "Tidewater": "models/Tidewater_model_pipeline.pkl",
    "N. Coastal Plain": "models/North_Coastal_Plain_model_pipeline.pkl",
    "S. Piedmont": "models/South_Piedmont_model_pipeline.pkl",
    "S. Coastal Plain": "models/South_Coastal_Plain_model_pipeline.pkl"
}
#-------------------------------------------------------------------------------------------------------------------
@app.route("/home", methods =['GET'])

def home():
    return jsonify(
        message="Hello from the Flask backend!"
    )

@app.route('/api/select_region', methods=['POST'])
def select_region():
    global current_model
    global new_df
    data = request.json
    selected_region = data.get('region')
    
    if not selected_region:
        return jsonify({"error": "No region provided"}), 400
    
    try:
        model_path, model = load_model(selected_region)
        current_model = model
        l = new_generate_data()
        new_df = inference(l,model)
        return jsonify({
            "message": f"Received region: {selected_region}",
            "model_path": model_path
        })
    except KeyError:
        return jsonify({"error": f"Invalid region: {selected_region}"}), 400
    except FileNotFoundError:
        return jsonify({"error": f"Model file not found for region: {selected_region}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
#----------------------------------------------------------------------------------------------------------------------
#Loading ML model based on region selected
def load_model(selected_region):
    print("in load model function")
    model_path = model_dict[selected_region.strip()]
    try:
        with open(model_path, 'rb') as file:
            model = joblib.load(file)
    except FileNotFoundError:
        raise FileNotFoundError(f"Model file not found for region: {selected_region}")
    except Exception as e:
        # print(e)
        raise Exception(f"Error loading the model: {e}")
    
    print(f"{model_path} model is selected")
    return model_path, model

def new_generate_data():
    pd_i = 92 #92
    pd_f = 212
    reference_year = 2024
    pd_arr = np.arange(pd_i, pd_f+1, 1) #72,212+1
    mg_array = np.arange(2, 8.1, 0.1)
    sr_array = np.arange(75000, 180000, 5000)
    print(f"pd_i, pd_f, ref_year: {pd_i},{pd_f},{reference_year}")
    print(f"pd_arr: {pd_arr}")
    l=[]
    for pd in pd_arr:
        for mg in mg_array:
            for sr in sr_array:
                l.append([pd, round(mg, 2), sr])
    l = np.array(l)
    print(f"l : {l}")
    return l

#Inference
def inference(batch_data, model):

    y = model.predict(batch_data)
    print(f"y: {y}")
    if y[0][0]<MIN_YIELD:
        y[0][0]=MIN_YIELD
    
    #batch_data from np.array to pd.DataFrame if not already
    if isinstance(batch_data, np.ndarray):
        batch_data_df = pd.DataFrame(batch_data, columns=["Planting Date", "Maturity Group", "Seeding Rate (seeds/acre)"])
    else:
        batch_data_df = batch_data

    y_df = pd.DataFrame(y,columns=['Predicted Yield'])
    newdf = pd.concat([batch_data_df,y_df],axis=1)

    # seeding_rate_mean = newdf['Seeding Rate (seeds/acre)'].mean()
    newdf = newdf.groupby(['Planting Date','Maturity Group'])['Predicted Yield'].mean().reset_index()
    #minmax standardization  on the predicted yield to get Yield Index
    y_min = newdf['Predicted Yield'].min()
    y_max = newdf['Predicted Yield'].max()
    newdf['Yield Index'] = ((newdf['Predicted Yield']-y_min)/(y_max-y_min))*100
    return newdf
#------------------------------------------------------------------------------------------------------------------------------
# Optimizer
#PD optimizer
@app.route('/api/pd_optimiser', methods=['POST'])
def pd_optimiser():
    global new_df
    try:
        # Get input data from the frontend
        data = request.json
        pd_start = data.get('start_date')  # Expected format: YYYY-MM-DD
        pd_end = data.get('end_date')    # Expected format: YYYY-MM-DD
        mg_min = float(data.get('mg_min', 2.0))  # Ensure mg_min is float
        mg_max = float(data.get('mg_max', 8.0))  # Ensure mg_max is float

        mg_range = [mg_min, mg_max]

        if not (pd_start and pd_end):
            return jsonify({"error": "Start date and End date are required."}), 400

        # Convert dates to day-of-year
        pd_start_num = int(datetime.strptime(pd_start, '%Y-%m-%d').timetuple().tm_yday)
        pd_end_num = int(datetime.strptime(pd_end, '%Y-%m-%d').timetuple().tm_yday)

        if pd_end_num < pd_start_num:
            return jsonify({"error": "End date cannot be before Start date."}), 400

        # Filter data based on inputs
        filtered_df = new_df[(new_df["Planting Date"] >= pd_start_num) & (new_df["Planting Date"] <= pd_end_num)]
        filtered_df = filtered_df[(filtered_df["Maturity Group"] >= mg_range[0]) & (filtered_df["Maturity Group"] <= mg_range[1])]

        # Convert Planting Date back to MM/DD/YYYY
        current_year = datetime.now().year
        filtered_df['Planting Date'] = filtered_df['Planting Date'].apply(
            lambda day_num: datetime.strptime(f"{current_year}-{int(day_num)}", "%Y-%j").strftime("%m/%d/%Y")
        )

        # Generate the plot
        fig, optimal_pd = plot_pd(filtered_df, "Planting Date", "Yield Index")

        # Format optimal planting date
        date_obj = datetime.strptime(optimal_pd, "%m/%d/%Y")
        formatted_opt_date = date_obj.strftime("%d %B %Y")

        # Serialize Plotly figure to JSON
        plot_json = fig.to_json()

        # Return the plot and optimal planting date
        response = {
            "plot": plot_json,  # Convert plotly figure to JSON
            "optimal_date": formatted_opt_date
        }
        return jsonify(response), 200

    except Exception as e:
        print(e)
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

def plot_pd(df, x_var, y_var, opt=True, base_val=0):
    mean_y_by_x = df.groupby([x_var])[y_var].mean().reset_index()
    max_y_row = mean_y_by_x.loc[mean_y_by_x["Yield Index"].idxmax()]
    
    x_optim = max_y_row[x_var]
    if isinstance(x_optim, (int, float)):
        x_optim = round(float(x_optim), 2)
    else:
        x_optim = datetime.strptime(x_optim, '%m/%d/%Y').strftime('%d %b %Y')

    fig = px.line(mean_y_by_x, x=x_var, y=y_var,
                  labels={x_var: x_var, y_var: "Relative Yield Potential"},
                  hover_data=[x_var, y_var])
    fig.update_traces(mode='markers+lines',marker=dict(size = 3))

    if opt:
        fig.add_scatter(x=[max_y_row[x_var]], y=[max_y_row[y_var]],
                        mode='markers', marker=dict(color='red', size=10), hoverinfo="skip",
                        name='Optimal Point')

    fig.update_layout(yaxis=dict(range=[base_val, mean_y_by_x[y_var].max() + 5]),
                      legend=dict(x=0.8, y=0))
    return fig, max_y_row[x_var]
#-----------------------------------------------------------------------------------------------------------------------------------
# Optimizer
#MG Optimizer
@app.route('/api/mg_optimiser', methods=['POST'])
def mg_optimiser():
    global new_df
    try:
        data = request.json
        pd_start = data.get('start_date')  # Expected format: YYYY-MM-DD
        pd_end = data.get('end_date')    # Expected format: YYYY-MM-DD
        mg_min = float(data.get('mg_min', 2.0))  # Ensure mg_min is float
        mg_max = float(data.get('mg_max', 8.0))  # Ensure mg_max is float

        mg_range = [mg_min,mg_max]
        if not (pd_start and pd_end):
            return jsonify({"error": "Start date and End date are required."}), 400

        # Convert dates to day-of-year
        pd_start_num = int(datetime.strptime(pd_start, '%Y-%m-%d').timetuple().tm_yday)
        pd_end_num = int(datetime.strptime(pd_end, '%Y-%m-%d').timetuple().tm_yday)

        current_year = datetime.now().year

        filtered_df = new_df[(new_df["Planting Date"] >= pd_start_num) & (new_df["Planting Date"] <= pd_end_num)] 
        # Convert 'Planting Date' from numerical day-of-year to formatted string (MM/DD/YYYY)
        filtered_df['Planting Date'] = filtered_df['Planting Date'].apply(lambda day_num: datetime.strptime(f"{current_year}-{int(day_num)}", "%Y-%j").strftime("%m/%d/%Y"))
        filtered_df = filtered_df[(filtered_df["Maturity Group"] >= mg_range[0]) & (filtered_df["Maturity Group"] <= mg_range[1])]

        fig,optimal_mg = plot_mg(filtered_df,"Maturity Group","Yield Index")

        # Format the optimal planting date if it's a date
        if isinstance(optimal_mg, str):
            date_obj = datetime.strptime(optimal_mg, "%m/%d/%Y")
            formatted_opt_date = date_obj.strftime("%d %B %Y")
        else:
            formatted_opt_date = optimal_mg  # Use as-is if it's not a date

        plot_json = fig.to_json()
        response = {
            "plot": plot_json,  # Convert plotly figure to JSON
            "optimal_date": formatted_opt_date
        }
        return jsonify(response), 200
    
    except Exception as e:
        print(e)
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

def plot_mg(df, x_var, y_var, opt=True, base_val=0):

    # Group data by x_var and calculate the mean of y_var
    mean_y_by_x = df.groupby([x_var])[y_var].mean().reset_index()

    # Find the row with the maximum yield index
    max_y_row = mean_y_by_x.loc[mean_y_by_x[y_var].idxmax()]
    x_optim = max_y_row[x_var]

    # Handle different types for x_optim
    if isinstance(x_optim, (float, int)):
        x_optim = round(x_optim, 2)  # Round numerical values
    else:
        # Parse and reformat date strings
        x_optim = datetime.strptime(x_optim, '%m/%d/%Y').strftime('%d %b %Y')
        mean_y_by_x[x_var] = mean_y_by_x[x_var].apply(
            lambda x: datetime.strptime(x, '%m/%d/%Y').strftime('%d %b %Y')
        )
        max_y_row[x_var] = datetime.strptime(max_y_row[x_var], '%m/%d/%Y').strftime('%d %b %Y')

    fig = px.line(mean_y_by_x, x=x_var, y=y_var,
                  labels={x_var: x_var, y_var: "Relative Yield Potential"},
                  hover_data=[x_var, y_var])
    fig.update_traces(mode='markers+lines',marker=dict(size = 3))

    if opt:
        fig.add_scatter(x=[max_y_row[x_var]], y=[max_y_row[y_var]],
                        mode='markers', marker=dict(color='red', size=10), hoverinfo="skip",
                        name='Optimal Point')

    fig.update_layout(yaxis=dict(range=[base_val, mean_y_by_x[y_var].max() + 5]),
                      legend=dict(x=0.8, y=0))

    return fig, x_optim

#------------------------------------------------------------------------------------------------------------------------------------
if __name__=="__main__":
    app.run(debug=True, port=8181)