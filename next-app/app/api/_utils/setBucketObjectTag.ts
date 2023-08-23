import { PutObjectTaggingCommand } from '@aws-sdk/client-s3';
import { s3client } from '../_aws';
import { AWS_S3_BUCKET } from '../_constants';

export const setBucketObjectTag = async function (
  objectKey: string,
  tagKey: string,
  tagValue: string
) {
  console.log('Set Tag:', objectKey, '| Value:', tagValue);
  const input = {
    // PutObjectTaggingRequest
    Bucket: AWS_S3_BUCKET.BUCKET, // required
    Key: objectKey, // required
    Tagging: {
      // Tagging
      TagSet: [
        // TagSet // required
        {
          // Tag
          Key: tagKey, // required
          Value: tagValue, // required
        },
      ],
    },
  };

  const command = new PutObjectTaggingCommand(input);
  await s3client.send(command);
};
