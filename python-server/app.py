import json
import base64
import numpy as np
from PIL import Image
from io import BytesIO
from models import predict, retrain_model
from utils import S3Client

# Constants
IMAGE_SIZE = (224, 224)
MIN_NUM_OF_IMAGES = 6
CHARACTER_KEYS = {
    "lisa_simpson": [],
    "bart_simpson": [],
    "homer_simpson": [],
    "marge_simpson": [],
}


def lambda_predict_image(event, context):
    """
    Lambda function to predict the Simpson character from an image.
    """
    image_bytes = event["body"]
    encoded_data = image_bytes.split(",")[1] if "," in image_bytes else image_bytes
    img_b64dec = base64.b64decode(encoded_data)
    img_byteIO = BytesIO(img_b64dec)
    img = Image.open(img_byteIO).convert("RGB")

    # Make prediction and sort results
    predict_data, predict_time = predict(img)
    sorted_predictions = dict(
        sorted(predict_data.items(), key=lambda x: x[1], reverse=True)
    )

    return {
        "statusCode": 200,
        "body": json.dumps(
            {"predict_data": sorted_predictions, "predict_time": predict_time}
        ),
    }


def fetch_and_transform_image(s3_client, key):
    """
    Fetches an image from S3 and applies necessary transformations.
    """
    image_stream = Image.open(s3_client.get_s3_object(key)).convert("RGB")
    return np.asarray(image_stream.resize(IMAGE_SIZE))


def lambda_retrain_function(event, context):
    s3_client = S3Client()
    training_data, current_keys = gather_training_data(s3_client, event["body"])

    if len(training_data["train"]) < MIN_NUM_OF_IMAGES:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Not enough data to retrain the model"}),
        }

    new_accuracy = retrain_model(
        np.array(training_data["train"]),
        np.array(training_data["test"]),
        event["body"].get("accuracy", 0),
    )

    if new_accuracy > event["body"].get("accuracy", 0):
        delete_images_from_s3(current_keys)

    return {
        "statusCode": 200,
        "body": json.dumps(
            {"model_accuracy": max(new_accuracy, event["body"].get("accuracy", 0))}
        ),
    }


def gather_training_data(s3_client, body):
    files = s3_client.get_s3_objects_list()
    data = {"train": [], "test": []}
    current_keys = CHARACTER_KEYS.copy()

    for file in files:
        key, purpose, class_name = preprocess_file(file, s3_client)
        if not purpose or len(current_keys[class_name]) >= body.get("min", 0):
            continue

        image = fetch_and_transform_image(s3_client, key)
        data[purpose].append((image, class_name))
        if purpose == "train":
            current_keys[class_name].append(key)

    return data, current_keys


def preprocess_file(file, s3_client):
    key = file["Key"]
    tags = s3_client.get_s3_object_tagging(key)
    purpose = tags.get("Value")
    class_name = tags.get("Value")
    return key, purpose, class_name


def delete_images_from_s3(keys_dict):
    s3_client = S3Client()
    for character, keys in keys_dict.items():
        for key in keys:
            s3_client.delete_s3_object(key)
