import os
import boto3


class S3Client:
    def __init__(self):
        # Fetching environment variables and adding error handling
        self.AWS_ACCESS_KEY = os.environ.get("AMAZON_ACCESS_KEY")
        if not self.AWS_ACCESS_KEY:
            raise ValueError("Environment variable AMAZON_ACCESS_KEY is not set.")

        self.AWS_SECRET_KEY = os.environ.get("AMAZON_SECRET_KEY")
        if not self.AWS_SECRET_KEY:
            raise ValueError("Environment variable AMAZON_SECRET_KEY is not set.")

        self.AMAZON_REGION = os.environ.get("AMAZON_REGION")
        if not self.AMAZON_REGION:
            raise ValueError("Environment variable AMAZON_REGION is not set.")

        self.AMAZON_BUCKET = os.environ.get("AMAZON_BUCKET")
        if not self.AMAZON_BUCKET:
            raise ValueError("Environment variable AMAZON_BUCKET is not set.")

        # Creating the boto3 client
        self.s3 = boto3.client(
            "s3",
            aws_access_key_id=self.AWS_ACCESS_KEY,
            aws_secret_access_key=self.AWS_SECRET_KEY,
            region_name=self.AMAZON_REGION,
        )

    def get_s3_object(self, key):
        obj = self.s3.get_object(Bucket=self.AMAZON_BUCKET, Key=key)
        return obj["Body"]

    def put_s3_object(self, body, key, bucket=None):
        if bucket is None:
            bucket = self.AMAZON_BUCKET
        obj = self.s3.put_object(Body=body, Bucket=bucket, Key=key)
        return None

    def get_s3_objects_list(self, bucket=None):
        if bucket is None:
            bucket = self.AMAZON_BUCKET
        obj = self.s3.list_objects_v2(Bucket=bucket)
        return obj.get("Contents", [])

    def delete_s3_object(self, key, bucket=None):
        if bucket is None:
            bucket = self.AMAZON_BUCKET
        obj = self.s3.delete_object(Bucket=bucket, Key=key)
        return obj.get("DeleteMarker", False)
