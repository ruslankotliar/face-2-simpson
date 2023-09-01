import { StringMap } from '../_types';

const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL;

const REQUEST_URL_PATHS: StringMap = {
  PREDICT_PERSON_IMG: '/predict/img',
  DELETE_PERSON_IMG: '/predict/feedback',
  STATISTICS: '/predict/statistics',
  RETRAIN_MODEL: '/cron/retrain',
};

const REQUEST_URL_KEYS = Object.keys(REQUEST_URL_PATHS).reduce(
  (acc, key) => ({
    ...acc,
    [key]: `${HOST_URL}/api${REQUEST_URL_PATHS[key]}`,
  }),
  {} as typeof REQUEST_URL_PATHS
);

export { REQUEST_URL_KEYS };
