import axios from 'axios';

import { PYTHON_API_ROUTES } from '../_constants';

export const retrainModel = async function (min: number, accuracy: number) {
  const { data } = await axios.post(PYTHON_API_ROUTES.RETRAIN_MODEL, {
    min,
    accuracy,
  });

  return data;
};
