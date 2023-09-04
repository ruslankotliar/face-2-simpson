import { StringMap } from '../../_types';

const PYTHON_API = process.env.PYTHON_API;

const AWS_S3_BUCKET: StringMap = {
  ACCESS_KEY: process.env.AWS_ACCESS_KEY as string,
  SECRET_KEY: process.env.AWS_SECRET_KEY as string,
  REGION: process.env.AWS_REGION as string,
  BUCKET: process.env.AWS_BUCKET as string,
};

const BUCKET_OBJ_TAG_KEYS: StringMap = {
  CLASS_NAME: 'class_name',
  PURPOSE: 'purpose',
};

let PYTHON_API_ROUTES: StringMap = {
  PREDICT_SIMPSON: '/predict/simpson',
  RETRAIN_MODEL: '/cron/retrain',
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

const ENOUGH_TRAIN_DATA: number = 8;

export {
  AWS_S3_BUCKET,
  PYTHON_API_ROUTES,
  BUCKET_OBJ_TAG_KEYS,
  DB_COUNTER_CHARS,
  ENOUGH_TRAIN_DATA,
};
