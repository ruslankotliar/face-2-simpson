from flask import Flask, jsonify, request
from PIL import Image
import numpy as np
from asgiref.wsgi import WsgiToAsgi

from models import predict, retrain_model
from utils import S3Client

app = Flask(__name__)

IMAGE_SIZE = (224, 224)
MIN_NUM_OF_IMAGES = 6
CHARACTER_KEYS = {
    "lisa_simpson": [],
    "bart_simpson": [],
    "homer_simpson": [],
    "marge_simpson": [],
}


@app.route("/predict/simpson", methods=["POST"])
def predict_image():
    """
    Endpoint to predict the Simpson character from an image.
    """
    key = request.json.get("key")
    if not key:
        return jsonify({"error": "No key found"}), 400

    s3_client = S3Client()
    file_stream = s3_client.get_s3_object(key)
    img = Image.open(file_stream).convert("RGB")

    predict_data, predict_time = predict(img)
    predict_data = dict(sorted(predict_data.items(), key=lambda x: x[1], reverse=True))

    return jsonify({"predict_data": predict_data, "predict_time": predict_time})


@app.route("/cron/retrain", methods=["POST"])
def retrain_function():
    minimum_class_names_count = request.json.get("min", 0)
    old_accuracy = request.json.get("accuracy", 0)

    s3_client = S3Client()
    files = s3_client.get_s3_objects_list()

    data = {"train": [], "test": []}
    current_keys = CHARACTER_KEYS.copy()

    i = 0
    for file in files:
        key = file["Key"]
        purpose, class_name = s3_client.get_s3_object_tagging(key)

        if (
            purpose["Value"] == "train"
            and len(current_keys[class_name["Value"]]) >= minimum_class_names_count
        ):
            continue

        print(f"{i}. {key}")
        i += 1

        image = fetch_and_transform_image(s3_client, key)
        data[purpose["Value"]].append((image, class_name["Value"]))

        if purpose["Value"] == "train":
            current_keys[class_name["Value"]].append(key)

    if minimum_class_names_count < MIN_NUM_OF_IMAGES:
        return "Not enough data to retrain the model", 400

    new_accuracy = retrain_model(
        np.array(data["train"]), np.array(data["test"]), old_accuracy
    )

    if new_accuracy > old_accuracy:
        delete_images_from_s3(current_keys)

    return jsonify({"model_accuracy": max(new_accuracy, old_accuracy)})


def fetch_and_transform_image(s3_client, key):
    """
    Fetches an image from S3 and applies necessary transformations.
    """
    image_stream = Image.open(s3_client.get_s3_object(key)).convert("RGB")
    return np.asarray(image_stream.resize(IMAGE_SIZE))


def delete_images_from_s3(keys_dict):
    s3_client = S3Client()

    for character, keys in keys_dict.items():
        for key in keys:
            response_status = s3_client.delete_s3_object(key)
            print(
                f"Deleted {key} for character {character}. Response: {response_status}"
            )


asgi_app = WsgiToAsgi(app)
