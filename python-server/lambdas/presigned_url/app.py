import json
import uuid
import boto3

from utils import S3Client

s3 = boto3.client("s3")

# constants
EXPIRATION = 60 * 2  # 2 minutes

def lambda_generate_presigned_url(event, context):
    key = f"temp/{uuid.uuid4()}"

    s3_client = S3Client(s3)
    url = s3_client.get_presigned_url(key, EXPIRATION)

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "url": url,
                "key": key,
            }
        ),
    }
