import { AxiosError } from 'axios';

import { StatusCodes, TIMEOUT_TRY_AGAIN, UNKNOWN_ERROR_MESSAGE } from '@src/constants';

const handleServerError = function (error: unknown): void {
  let message: string | undefined;

  if (error instanceof AxiosError) {
    const { response } = error;
    const code = response?.status;

    if (code === StatusCodes.GATEWAY_TIMEOUT) {
      message = TIMEOUT_TRY_AGAIN;
    } else {
      message = response?.data.error;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  if (!message) {
    message = UNKNOWN_ERROR_MESSAGE;
  }

  throw new Error(message);
};

export { handleServerError };
