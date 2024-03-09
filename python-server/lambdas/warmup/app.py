import boto3
import json
import os

from constants import WARM_UP_KEY, WARM_UP_VALUE

# Create an AWS Lambda client
lambda_client = boto3.client("lambda")


def lambda_warmup(event, context):
    try:
        # Define dummy events for both lambda_predict_image and lambda_detect_face functions
        dummy_event = {"body": json.dumps({WARM_UP_KEY: WARM_UP_VALUE})}

        predict_image_arn = os.environ.get("PREDICT_IMAGE_ARN", "")
        detect_face_arn = os.environ.get("DETECT_FACE_ARN", "")

        # Check if ARNs are provided
        if not predict_image_arn or not detect_face_arn:
            raise ValueError("One or both ARNs are missing.")

        response_predict_image = lambda_client.invoke(
            FunctionName=predict_image_arn,
            InvocationType="Event",  # Asynchronous invocation
            Payload=json.dumps(dummy_event),
        )

        response_detect_face = lambda_client.invoke(
            FunctionName=detect_face_arn,
            InvocationType="Event",  # Asynchronous invocation
            Payload=json.dumps(dummy_event),
        )

        # Check if both invocations were successful
        if (
            response_predict_image["StatusCode"] == 202
            and response_detect_face["StatusCode"] == 202
        ):
            return {
                "statusCode": 200,
                "body": json.dumps(
                    "Warm-up successful for lambda_predict_image and lambda_detect_face"
                ),
            }
        else:
            raise Exception(
                "One or both lambda functions failed to respond with the expected status code."
            )
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps(f"Warm-up failed: {str(e)}"),
        }
