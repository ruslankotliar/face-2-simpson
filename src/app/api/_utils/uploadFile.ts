import { v4 as uuidv4 } from 'uuid';
import { Upload } from '@aws-sdk/lib-storage';
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';

import { AWS_S3_BUCKET } from '../_constants';
import { PREDICT_SIMP_FILENAME } from '@/app/_constants';
import s3 from '../_aws/awsConfig';
import { getBucketObject } from '.';

export const uploadFile = async function (
  file: File
): Promise<string | undefined> {
  const filename = `${PREDICT_SIMP_FILENAME}-${uuidv4()}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const parallelUploads3 = new Upload({
    client: s3,
    params: {
      Bucket: AWS_S3_BUCKET.BUCKET,
      Key: filename,
      Body: buffer,
    },
    tags: [
      /*...*/
    ], // optional tags
    queueSize: 4, // optional concurrency configuration
    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
    leavePartsOnError: false, // optional manually handle dropped parts
  });

  parallelUploads3.on('httpUploadProgress', ({ Key }) => {
    console.log(`Uploading to aws: ${Key}`);
  });

  const data =
    (await parallelUploads3.done()) as CompleteMultipartUploadCommandOutput;

  const pathname = await getBucketObject(data.Key);

  return pathname;
};
