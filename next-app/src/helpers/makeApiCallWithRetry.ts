import axios from 'axios';
import axiosRetry from 'axios-retry';

import { handleServerError } from '@src/utils/error';
import { StatusCodes } from '@src/constants';

// this is done to handle AWS Lambda cold start
axiosRetry(axios, {
  retries: 2,
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
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
