import { StringMap } from '../_types';

const REQUEST_URL_KEYS: StringMap = {
  PREDICT_PERSON_IMG: '/predict/simpson',
  DELETE_PERSON_IMG: '/predict/feedback',
  RETRAIN_MODEL: '/cron/retrain',
  PREDICTION_TIME_CHART: '/charts/predictionTime/:unit',
  CHARACTER_PREDICTED_CHART: '/charts/characterPredicted',
  MODEL_ACCURACY_CHART: '/charts/modelAccuracy',
};

export { REQUEST_URL_KEYS };
