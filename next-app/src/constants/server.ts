import { StringMap } from '@src/types';

const PYTHON_API = process.env.PYTHON_API;

const AWS_S3_BUCKET: StringMap = {
  ACCESS_KEY: process.env.AMAZON_ACCESS_KEY as string,
  SECRET_KEY: process.env.AMAZON_SECRET_KEY as string,
  REGION: process.env.AWS_REGION as string,
  BUCKET: process.env.AWS_BUCKET as string,
};

let PYTHON_API_ROUTES: StringMap = {
  PREDICT_SIMPSON: '/predict',
  RETRAIN_MODEL: '/retrain',
  GENERATE_PRESIGNED_URL: '/generate-presigned-url',
};

PYTHON_API_ROUTES = Object.keys(PYTHON_API_ROUTES).reduce(
  (acc, route) => ({ ...acc, [route]: PYTHON_API + PYTHON_API_ROUTES[route] }),
  {}
);

const DB_COUNTER_CHARS: string[] = [
  'bart_simpson',
  'homer_simpson',
  'lisa_simpson',
  'marge_simpson',
];

const S3_OBJ_EXPIRES_IN: number = 60 * 2;

const ENOUGH_TRAIN_DATA: number = 8;

export {
  AWS_S3_BUCKET,
  PYTHON_API_ROUTES,
  DB_COUNTER_CHARS,
  ENOUGH_TRAIN_DATA,
  S3_OBJ_EXPIRES_IN,
};
