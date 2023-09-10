import axios from 'axios';

import { PYTHON_API_ROUTES } from '../_constants';
import { FORM_DATA_KEYS } from '@app/_constants';

export const predictSimpson = async function (img: File) {
  try {
    const formData = new FormData();
    formData.append(FORM_DATA_KEYS.PREDICTION_IMG, img);

    const { data } = await axios.post(
      PYTHON_API_ROUTES.PREDICT_SIMPSON,
      formData
    );

    return data;
  } catch (e) {
    console.error(e);
    if (e instanceof Error) throw Error(e.message);
  }
};
