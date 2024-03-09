import { PYTHON_API_ROUTES } from '@src/constants';
import { handleServerError } from '@src/utils/error';
import axios from 'axios';

export const warmup = async function () {
  try {
    await axios.post(PYTHON_API_ROUTES.WARMUP);
  } catch (e) {
    handleServerError(e);
  }
};
