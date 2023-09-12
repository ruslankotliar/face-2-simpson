import json
import uuid
import boto3

from io import BytesIO
import numpy as np
from PIL import Image
from typing import Dict, Union

from utils import S3Client

s3 = boto3.client("s3")

# Constants
IMAGE_SIZE = (224, 224)
MIN_NUM_OF_IMAGES = 6
CHARACTER_KEYS = {
    "lisa_simpson": [],
    "bart_simpson": [],
    "homer_simpson": [],
    "marge_simpson": [],
}

SimpsonCharacter = Union[
    "bart_simpson", "homer_simpson", "lisa_simpson", "marge_simpson"
]


def lambda_generate_presigned_url(event, context):
    key = f"temp/{uuid.uuid4()}"
    s3_client = S3Client(s3)
    url = s3_client.get_presigned_url(key)

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "url": url,
                "key": key,
            }
        ),
    }


def get_max_similar_char(data: Dict[SimpsonCharacter, int]) -> SimpsonCharacter:
    # Here, we get the key associated with the max value in the dictionary
    return max(data, key=data.get)


def lambda_predict_image(event, context):
    from models import predict

    """
    Lambda function to predict the Simpson character from an image.
    """
    s3_client = S3Client(s3)

    img_key = event["body"]

    s3_object = s3_client.get_s3_object(img_key)

    img = Image.open(s3_object).convert("RGB")

    # Make prediction and sort results
    predict_data, predict_time = predict(img)
    sorted_predictions = dict(
        sorted(predict_data.items(), key=lambda x: x[1], reverse=True)
    )

    s3_client = S3Client(s3)

    character_predicted = get_max_similar_char(sorted_predictions)
    image_bucket_key = f"train/{character_predicted}/{uuid.uuid4()}"
    s3_client.put_s3_object(s3_object.read(), image_bucket_key)

    s3_client.delete_s3_object(img_key)  # remove obj created with presigned url

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "predict_data": sorted_predictions,
                "predict_time": predict_time,
                "image_bucket_key": image_bucket_key,
            }
        ),
    }


def fetch_and_transform_image(s3_client, key):
    """
    Fetches an image from S3 and applies necessary transformations.
    """
    image_stream = Image.open(s3_client.get_s3_object(key)).convert("RGB")
    return np.asarray(image_stream.resize(IMAGE_SIZE))


def lambda_retrain_function(event, context):
    from models import retrain_model

    s3_client = S3Client(s3)
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
