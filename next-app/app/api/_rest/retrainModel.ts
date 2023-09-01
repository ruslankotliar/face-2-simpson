import axios from 'axios';

import { PYTHON_API_ROUTES } from '../_constants';

export const retrainModel = async function () {
  const { data } = await axios.post(PYTHON_API_ROUTES.RETRAIN_MODEL);

  return data;
};
