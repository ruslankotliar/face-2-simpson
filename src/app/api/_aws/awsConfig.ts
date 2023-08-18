import { S3Client } from '@aws-sdk/client-s3';

import { AWS_S3_BUCKET } from '../_constants';

const s3 = new S3Client({
  credentials: {
    accessKeyId: AWS_S3_BUCKET.ACCESS_KEY,
    secretAccessKey: AWS_S3_BUCKET.SECRET_KEY,
  },
  region: AWS_S3_BUCKET.REGION,
});

export default s3;
