import { PYTHON_API_ROUTES } from '@src/constants';
import axios, { AxiosError } from 'axios';

export const signUrl = async function () {
  try {
    const { data } = await axios.post(PYTHON_API_ROUTES.GENERATE_PRESIGNED_URL);

    return data;
  } catch (e) {
    if (e instanceof AxiosError) throw new Error(e.response?.data.error);
  }
};
