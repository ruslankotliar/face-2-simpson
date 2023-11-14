import { PYTHON_API_ROUTES } from '@src/constants';
import { handleServerError } from '@src/utils/error';
import axios from 'axios';

export const signUrl = async function () {
  try {
    const { data } = await axios.post(PYTHON_API_ROUTES.GENERATE_PRESIGNED_URL);

    return data;
  } catch (e) {
    handleServerError(e);
  }
};
