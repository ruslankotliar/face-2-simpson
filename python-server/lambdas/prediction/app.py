import json
import uuid
import os
import boto3
import base64

from botocore.exceptions import ClientError

import numpy as np
from io import BytesIO
from PIL import Image
from typing import Dict, Union

from utils import S3Client

s3 = boto3.client("s3")


# Constants
IMAGE_SIZE = (224, 224)
MIN_NUM_OF_IMAGES = 8
CLASS_NAMES_PATH = "models/predict/class_names.txt"
MODEL_PATH = "models/predict/simpsons_model.pth"
CHARACTER_KEYS = {
    "lisa_simpson": [],
    "bart_simpson": [],
    "homer_simpson": [],
    "marge_simpson": [],
}

SimpsonCharacter = Union[
    "bart_simpson", "homer_simpson", "lisa_simpson", "marge_simpson"
]


def lambda_predict_image(event, context):
    try:
        from models import predict

        """
        Lambda function to predict the Simpson character from an image.
        """
        s3_client = S3Client(s3)

        body_encoded = event["body"]
        body_str = base64.b64decode(body_encoded).decode("utf-8")
        body_obj = json.loads(body_str)

        img_key = body_obj.get("signedKey", None)

        if not img_key:
            raise Exception("No image key provided")

        s3_object = s3_client.get_s3_object(img_key)
        img = Image.open(s3_object).convert("RGB")

        # Make prediction and sort results
        predict_data, predict_time = predict(img)
        sorted_predictions = dict(
            sorted(predict_data.items(), key=lambda x: x[1], reverse=True)
        )

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

    except ClientError as e:
        print(f"An error occurred with AWS: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "An error occurred with AWS services."}),
        }

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps(
                {"error": "An unexpected error occurred. Please try again later."}
            ),
        }


def get_max_similar_char(data: Dict[SimpsonCharacter, int]) -> SimpsonCharacter:
    # Here, we get the key associated with the max value in the dictionary
    return max(data, key=data.get)


def lambda_retrain_function(event, context):
    try:
        from models import retrain_model

        body_encoded = event["body"]
        body_str = base64.b64decode(body_encoded).decode("utf-8")
        body_obj = json.loads(body_str)

        old_accuracy = body_obj.get("accuracy", 0)
        minimum_class_names_count = body_obj.get("min", 0)

        if minimum_class_names_count < MIN_NUM_OF_IMAGES:
            raise Exception("Not enough data to retrain the model")

        s3_client = S3Client(s3)
        files = s3_client.get_s3_objects_list()

        data = {"train": [], "test": []}
        current_keys = CHARACTER_KEYS.copy()

        for i, file in enumerate(files):
            file_name, purpose, class_name = preprocess_file(file)

            if (
                purpose == "train"
                and len(current_keys[class_name]) >= minimum_class_names_count
            ):
                continue

            print(f"{i}. {file_name}")

            img = fetch_and_transform_image(s3_client, file_name)

            data[purpose].append((img, class_name))

            if purpose == "train":
                current_keys[class_name].append(file_name)

        new_accuracy = retrain_model(
            np.array(data["train"]), np.array(data["test"]), old_accuracy
        )

        if new_accuracy > old_accuracy:
            delete_images_from_s3(current_keys)

        return {
            "statusCode": 200,
            "body": json.dumps({"model_accuracy": max(new_accuracy, old_accuracy)}),
        }

    except ClientError as e:
        print(f"An error occurred with AWS: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "An error occurred with AWS services."}),
        }

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps(
                {"error": "An unexpected error occurred. Please try again later."}
            ),
        }


def fetch_and_transform_image(s3_client, key):
    """
    Fetches an image from S3 and applies necessary transformations.
    """
    s3_object = s3_client.get_s3_object(key)
    img = Image.open(s3_object).convert("RGB")

    img_resized = img.resize(IMAGE_SIZE)

    return img_resized


def gather_training_data(s3_client, body):
    files = s3_client.get_s3_objects_list()
    data = {"train": [], "test": []}
    current_keys = CHARACTER_KEYS.copy()

    for file in files:
        key, purpose, class_name = preprocess_file(file)
        if not purpose or len(current_keys[class_name]) >= body.get("min", 0):
            continue

        image = fetch_and_transform_image(s3_client, key)
        data[purpose].append((image, class_name))
        if purpose == "train":
            current_keys[class_name].append(key)

    return data, current_keys


def preprocess_file(file):
    file_name = file["Key"]
    purpose, class_name, _ = file_name.split("/")
    return file_name, purpose, class_name


def delete_images_from_s3(keys_dict):
    s3_client = S3Client()
    for character, keys in keys_dict.items():
        for key in keys:
            s3_client.delete_s3_object(key)
