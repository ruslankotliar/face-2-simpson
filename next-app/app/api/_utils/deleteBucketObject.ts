import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3client } from '../_aws';
import { AWS_S3_BUCKET } from '../_constants';

export const deleteBucketObject = async function (objectKey: string) {
  console.log('Delete: ', objectKey);
  const input = {
    // DeleteObjectRequest
    Bucket: AWS_S3_BUCKET.BUCKET, // required
    Key: objectKey, // required
  };
  const command = new DeleteObjectCommand(input);
  await s3client.send(command);
};
