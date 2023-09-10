import axios from 'axios';

import { PYTHON_API_ROUTES } from '../_constants';

export const predictSimpson = async function (imgBase64: string) {
  try {
    const { data } = await axios.post(
      PYTHON_API_ROUTES.PREDICT_SIMPSON,
      imgBase64
    );

    return data;
  } catch (e) {
    console.error(e);
    if (e instanceof Error) throw Error(e.message);
  }
};
