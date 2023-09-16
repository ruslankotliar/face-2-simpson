import { PYTHON_API_ROUTES } from '@src/constants';
import axios from 'axios';

export const retrainModel = async function (min: number, accuracy: number) {
  try {
    const payload = JSON.stringify({ min, accuracy });
    const body =
      process.env.NODE_ENV === 'development' ? btoa(payload) : payload;

    const { data } = await axios.post(PYTHON_API_ROUTES.RETRAIN_MODEL, body);

    return data;
  } catch (e) {
    if (e instanceof Error) throw Error(e.message);
  }
};
