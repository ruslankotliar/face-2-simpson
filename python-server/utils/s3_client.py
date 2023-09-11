import os


class S3Client:
    def __init__(self, s3):
        self.AMAZON_BUCKET = os.environ.get("AMAZON_BUCKET")

        self.s3 = s3

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
