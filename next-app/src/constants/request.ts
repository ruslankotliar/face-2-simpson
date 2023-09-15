import { StringMap } from '@src/types';

const REQUEST_URL_KEYS: StringMap = {
  UPLOAD_IMAGE: '/upload/image',
  REQUEST_PREDICTION: '/prediction/request',
  SEND_PREDICTION_FEEDBACK: '/prediction/feedback',
  RETRAIN_MODEL: '/cron/retrain',
  PREDICTION_TIME_CHART: '/charts/predictionTime/:unit',
  CHARACTER_PREDICTED_CHART: '/charts/characterPredicted',
  MODEL_ACCURACY_CHART: '/charts/modelAccuracy',
};

export { REQUEST_URL_KEYS };
