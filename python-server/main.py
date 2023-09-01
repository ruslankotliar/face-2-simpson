from asgiref.wsgi import WsgiToAsgi
from flask import Flask, jsonify, request
from PIL import Image
from collections import Counter
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

    predict_data = dict(sorted(predict_data.items(), key=lambda x: x[1], reverse=True))

    response = { 'predict_data': predict_data, 'predict_time': predict_time}

    return jsonify(response)


@app.route('/predict/statistics', methods=['GET'])
def request_statistics():
    
    return jsonify(None)


@app.route('/cron/retrain', methods=['POST'])
def retrain_function():
    IMAGE_SIZE = (224,224)
    MIN_NUM_OF_IMAGES = 6

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

        image = Image.open(s3_client.get_s3_object(key)).convert('RGB').resize(IMAGE_SIZE)
        dct[purpose['Value']].append((np.asarray(image), class_name['Value']))
    # TASK (ongoing) ↓
    # if lenght of list of images for each character is lower than 8 -> date of retrain += 7 days
    # else
    # retrain_model(...)
    # Let's use MIN amount of images for each character. E.g.
    # Lisa - 10
    # Bart - 9
    # Homer - 13
    # Marge - 28
    # We will use 9 (min_idx = Bart) images for each character to prevent underfitting.

    numpy_train_images = np.array(dct['train'])
    train_class_names_count = dict(Counter(numpy_train_images[:,1]))
    minimum_class_names_count = min(train_class_names_count.values())
    if minimum_class_names_count < MIN_NUM_OF_IMAGES:
        print(f'''
        There are not enough images to retrain model.\n
        Dictionary of number of images per class name: {train_class_names_count}\n
        Shift the retrain date by 7 days.
        ''')
        return "Not enough data to retrain the model", 400
        # TASK
        # retrain date += 7 days
    else:
        # TASK (ongoing) ↓
        # Reduce number of images for each character to minimum_class_names_count.
        #
        # Left:
        # Other images should be sent back to AWS (train tag)

        new_train_array = []
        for img in numpy_train_images.tolist():
            if len([el[1] for el in new_train_array if el[1] == img[1]]) < minimum_class_names_count:
                new_train_array.append(img)

        model_accuracy = retrain_model(np.array(new_train_array), np.array(dct['test']))

    return jsonify({'model_accuracy': model_accuracy})

asgi_app = WsgiToAsgi(app)

