import os


class S3Client:
    def __init__(self, s3):
        self.AMAZON_BUCKET = os.environ.get("AMAZON_BUCKET")

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

        except Exception as e:
            print(f"An error occurred: {e}")
            raise

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
