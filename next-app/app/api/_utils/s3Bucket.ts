import { Upload } from '@aws-sdk/lib-storage';

import { s3client } from '../_aws';
import { AWS_S3_BUCKET } from '../_constants';
import { DeleteObjectCommand, Tag } from '@aws-sdk/client-s3';

const s3Bucket = {
  putObject: async function (
    input: File | Buffer,
    key: string,
    tags: Tag[] = []
  ): Promise<void> {
    const buffer =
      input instanceof Buffer ? input : Buffer.from(await input.arrayBuffer());

    const parallelUploads3 = new Upload({
      client: s3client,
      params: {
        Bucket: AWS_S3_BUCKET.BUCKET,
        Key: key,
        Body: buffer,
      },
      tags,
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false, // optional manually handle dropped parts
    });

    parallelUploads3.on('httpUploadProgress', ({ Key }) => {
      console.log(`Upload success: ${Key}`);
    });

    await parallelUploads3.done();
  },

  // putTagging: async function (objectKey: string, tags: Tag[]) {
  //   const input = {
  //     // PutObjectTaggingRequest
  //     Bucket: AWS_S3_BUCKET.BUCKET, // required
  //     Key: objectKey, // required
  //     Tagging: {
  //       // Tagging
  //       TagSet: tags,
  //     },
  //   };

  //   const command = new PutObjectTaggingCommand(input);
  //   await s3client.send(command);

  //   console.log('Object:', objectKey, '| Set Tags:', tags);
  // },

  deleteObject: async function (objectKey: string) {
    console.log('Delete: ', objectKey);
    const input = {
      // DeleteObjectRequest
      Bucket: AWS_S3_BUCKET.BUCKET, // required
      Key: objectKey, // required
    };
    const command = new DeleteObjectCommand(input);
    await s3client.send(command);
  },
};

export { s3Bucket };
