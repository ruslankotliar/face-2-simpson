import axios from 'axios';

import { PYTHON_API_ROUTES } from '../constants/server';

export const signUrl = async function () {
  try {
    const { data } = await axios.get(PYTHON_API_ROUTES.GENERATE_PRESIGNED_URL);

    return data;
  } catch (e) {
    if (e instanceof Error) throw Error(e.message);
  }
};
