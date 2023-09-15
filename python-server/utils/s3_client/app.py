import os
from botocore.exceptions import ClientError


class S3Client:
    def __init__(self, s3):
        self.AMAZON_BUCKET = os.environ.get("AMAZON_BUCKET", "")
        self.s3 = s3

    def get_presigned_url(self, key, expiration=30, bucket=None):
        bucket = bucket or self.AMAZON_BUCKET

        try:
            url = self.s3.generate_presigned_url(
                "put_object",
                Params={"Bucket": bucket, "Key": key},
                ExpiresIn=expiration,
            )
            return url

        except ClientError as e:
            print(f"Failed to generate presigned URL for S3. Error: {e}")
            raise

    def get_s3_object(self, key):
        try:
            obj = self.s3.get_object(Bucket=self.AMAZON_BUCKET, Key=key)
            return obj["Body"]

        except ClientError as e:
            print(f"Failed to get S3 object with key {key}. Error: {e}")
            raise

    def put_s3_object(self, body, key, bucket=None):
        bucket = bucket or self.AMAZON_BUCKET

        try:
            self.s3.put_object(Body=body, Bucket=bucket, Key=key)
            return True

        except ClientError as e:
            print(f"Failed to put S3 object with key {key}. Error: {e}")
            return False

    def get_s3_objects_list(self, bucket=None):
        bucket = bucket or self.AMAZON_BUCKET

        try:
            obj = self.s3.list_objects_v2(Bucket=bucket)
            return obj.get("Contents", [])

        except ClientError as e:
            print(f"Failed to list objects for bucket {bucket}. Error: {e}")
            raise

    def delete_s3_object(self, key, bucket=None):
        bucket = bucket or self.AMAZON_BUCKET

        try:
            obj = self.s3.delete_object(Bucket=bucket, Key=key)
            return obj.get("DeleteMarker", False)

        except ClientError as e:
            print(f"Failed to delete S3 object with key {key}. Error: {e}")
            return False
