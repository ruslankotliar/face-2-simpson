import axios from 'axios';

import { PYTHON_API_ROUTES } from '../constants/server';

export const retrainModel = async function (min: number, accuracy: number) {
  try {
    const body = btoa(JSON.stringify({ min, accuracy }));

    const { data } = await axios.post(PYTHON_API_ROUTES.RETRAIN_MODEL, body);

    return data;
  } catch (e) {
    if (e instanceof Error) throw Error(e.message);
  }
};
