import boto3
import json

from constants import WARM_UP_KEY, WARM_UP_VALUE

# Create an AWS Lambda client
lambda_client = boto3.client("lambda")


def lambda_handler(event, context):
    # Define dummy events for both lambda_predict_image and lambda_detect_face functions
    dummy_event = {"body": json.dumps({WARM_UP_KEY: WARM_UP_VALUE})}

    # Warm-up lambda_predict_image function
    response_predict_image = lambda_client.invoke(
        FunctionName="lambda_predict_image",
        InvocationType="RequestResponse",  # Synchronous invocation
        Payload=json.dumps(dummy_event_predict_image),
    )

    # Warm-up lambda_detect_face function
    response_detect_face = lambda_client.invoke(
        FunctionName="lambda_detect_face",
        InvocationType="RequestResponse",  # Synchronous invocation
        Payload=json.dumps(dummy_event_detect_face),
    )

    # Check if both invocations were successful
    if (
        response_predict_image["StatusCode"] == 200
        and response_detect_face["StatusCode"] == 200
    ):
        return {
            "statusCode": 200,
            "body": json.dumps(
                "Warm-up successful for lambda_predict_image and lambda_detect_face"
            ),
        }
    else:
        return {
            "statusCode": 500,
            "body": json.dumps(
                "Warm-up failed for lambda_predict_image and lambda_detect_face"
            ),
        }
