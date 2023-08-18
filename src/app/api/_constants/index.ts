import { StringMap } from '@/app/_types';
import path from 'path';

const PROJECT_PATH = process.cwd();

const FILE_PATHS: StringMap = {
  UPLOAD: path.join(PROJECT_PATH, 'public/upload'),
  PREDICT_MODEL: path.join(PROJECT_PATH, 'src/app/api/_models/predict/app.py'),
};

const AWS_S3_BUCKET: StringMap = {
  ACCESS_KEY: process.env.AWS_ACCESS_KEY as string,
  SECRET_KEY: process.env.AWS_SECRET_KEY as string,
  REGION: process.env.AWS_REGION as string,
  BUCKET: process.env.AWS_BUCKET as string,
};

export { FILE_PATHS, AWS_S3_BUCKET };
