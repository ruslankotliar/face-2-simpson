import { AWS_S3_BUCKET } from '../_constants';
import { S3Client } from '@aws-sdk/client-s3';

export const s3client = new S3Client({
  credentials: {
    accessKeyId: AWS_S3_BUCKET.ACCESS_KEY,
    secretAccessKey: AWS_S3_BUCKET.SECRET_KEY,
  },
  region: AWS_S3_BUCKET.REGION,
});
