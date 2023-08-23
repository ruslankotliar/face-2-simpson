from asgiref.wsgi import WsgiToAsgi
from flask import Flask, jsonify, request
from PIL import Image

from models import predict

from utils import S3Client

app = Flask(__name__)

@app.route('/predict/simpson', methods=['POST'])
def predict_image():
    key = request.json.get('key')
    print('Request:', key)
    if not key:
        return jsonify({"error": "No key found"}), 400

    s3_client = S3Client()
    file_stream = s3_client.get_s3_object(key)
    img = Image.open(file_stream)
    
    predict_data, predict_time = predict(img)

    response = { 'predict_data': predict_data, 'predict_time': predict_time}

    return jsonify(response)

asgi_app = WsgiToAsgi(app)
