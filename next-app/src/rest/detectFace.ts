import axios, { Axios, AxiosError } from 'axios';

import { PYTHON_API_ROUTES } from '@src/constants';

export const detectFace = async function (signedKey: string) {
  try {
    const payload = JSON.stringify({ signedKey });
    const body = process.env.NODE_ENV === 'development' ? btoa(payload) : payload;

    const { data } = await axios.post(PYTHON_API_ROUTES.DETECT_FACE, body);

    return data;
  } catch (e) {
    const err = e as any;
    console.log(e);
    console.log(err.response);
    console.log(err.response.data);
    console.log(err.response.data.error);
    if (e instanceof AxiosError)
      throw new Error(`Error on python server: ${e.response?.data.error}`);
  }
};
