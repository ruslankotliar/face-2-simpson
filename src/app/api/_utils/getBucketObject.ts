import { GetObjectCommand } from '@aws-sdk/client-s3';
import { existsSync, createWriteStream } from 'fs';
import fs from 'fs/promises';
import path from 'path';

import { AWS_S3_BUCKET, FILE_PATHS } from '../_constants';
import s3 from '../_aws/awsConfig';

export const getBucketObject = async function (
  key: string | undefined
): Promise<string | undefined> {
  if (!key) throw Error('Bucket object Key is missing.');

  const command = new GetObjectCommand({
    Bucket: AWS_S3_BUCKET.BUCKET,
    Key: key,
  });

  try {
    const destinationDirPath = FILE_PATHS.UPLOAD;
    if (!existsSync(destinationDirPath)) {
      fs.mkdir(destinationDirPath, { recursive: true });
    }

    const data = await s3.send(command);

    const bytes = await data.Body!.transformToByteArray();
    const buffer = Buffer.from(bytes);

    const pathname = path.join(destinationDirPath, key + '.jpeg');
    await fs.writeFile(pathname, Buffer.from(buffer));

    return pathname;
  } catch (err) {
    console.error(err);
  }
};
