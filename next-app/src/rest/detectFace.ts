import axios, { AxiosError } from 'axios';

import { PYTHON_API_ROUTES } from '@src/constants';

export const detectFace = async function (signedKey: string) {
  try {
    const payload = JSON.stringify({ signedKey });
    const body = process.env.NODE_ENV === 'development' ? btoa(payload) : payload;

    const { data } = await axios.post(PYTHON_API_ROUTES.DETECT_FACE, body);

    return data;
  } catch (e) {
    if (e instanceof AxiosError) throw new Error(e.response?.data.error);
  }
};
