from asgiref.wsgi import WsgiToAsgi
from flask import Flask, jsonify, request
from PIL import Image
import numpy as np

from models import predict
from models import retrain_model

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


@app.route('/cron/retrain', methods=['POST'])
def retrain_function():
    IMAGE_SIZE = (224,224)

    s3_client = S3Client()
    files = s3_client.get_s3_objects_list()

    train, test = [], []
    dct = {'train':[], 'test':[]}
    
    for i, file in enumerate(files):
        key = file['Key']
        print(i, key)
        dict_object = s3_client.get_s3_object_tagging(key)
        print(dict_object)

        purpose, class_name = dict_object

        image = Image.open(s3_client.get_s3_object(key)).resize(IMAGE_SIZE)
        dct[purpose['Value']].append((image, class_name['Value']))

    retrain_model(np.array(dct['train']), np.array(dct['test']))
    return jsonify(None)

asgi_app = WsgiToAsgi(app)

