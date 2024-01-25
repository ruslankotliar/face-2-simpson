import axios from 'axios';
import axiosRetry from 'axios-retry';

import { handleServerError } from '@src/utils/error';
import { RETRY_MESSAGES, StatusCodes } from '@src/constants';
import { toast } from 'react-toastify';
import { AlertIconKeys, AlertOptions } from '@src/types';

// this is done to handle AWS Lambda cold start
axiosRetry(axios, {
  retries: 4,
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    toast[AlertOptions.info](RETRY_MESSAGES[retryCount - 1], {
      position: toast.POSITION.TOP_CENTER,
      icon: AlertIconKeys.homerError,
      autoClose: 2000
    });
    return retryCount * 1000; // time interval between retries
  },
  retryCondition: (e) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return e?.response?.status === StatusCodes.GATEWAY_TIMEOUT;
  }
});

const makeApiCallWithRetry = async (url: string, key: string): Promise<any | undefined> => {
  try {
    const response = await axios.post(url, { key });
    return response.data;
  } catch (e) {
    handleServerError(e);
  }
};

export { makeApiCallWithRetry };
