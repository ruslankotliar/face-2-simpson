import axios from 'axios';

import { PYTHON_API_ROUTES } from '../_constants';

export const predictSimpson = async function (imgBase64: string) {
  try {
    console.log(PYTHON_API_ROUTES.PREDICT_SIMPSON);
    const { data } = await axios.post(PYTHON_API_ROUTES.PREDICT_SIMPSON, {
      body: imgBase64,
    });

    return data;
  } catch (e) {
    if (e instanceof Error) throw Error(e.message);
  }
};
