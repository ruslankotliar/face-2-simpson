import { StringMap } from '../../_types';

const AWS_S3_BUCKET: StringMap = {
  ACCESS_KEY: process.env.AWS_ACCESS_KEY as string,
  SECRET_KEY: process.env.AWS_SECRET_KEY as string,
  REGION: process.env.AWS_REGION as string,
  BUCKET: process.env.AWS_BUCKET as string,
};

export { AWS_S3_BUCKET };
