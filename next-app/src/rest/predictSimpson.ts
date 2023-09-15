import axios from 'axios';

import { PYTHON_API_ROUTES } from '../constants/server';

export const predictSimpson = async function (signedKey: string) {
  try {
    const { data } = await axios.post(
      PYTHON_API_ROUTES.PREDICT_SIMPSON,
      signedKey
    );

    return data;
  } catch (e) {
    if (e instanceof Error)
      throw new Error(`Error on python server: ${e.name} - ${e.message}`);
  }
};
