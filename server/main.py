from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app,origins='*')

@app.route("/home", methods =['GET'])

def home():
    return jsonify(
        {
            "soybean":[
                '1',
               '2',
               '3'
            ]
        }
    )

if __name__=="__main__":
    app.run(debug=True, port=8181)