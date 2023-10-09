import { AxiosError } from 'axios';

const handleClientError = function (e: unknown) {
  console.error(e);
  if (e instanceof AxiosError) throw new Error(e.response?.data.error);
  if (e instanceof Error) throw Error(e.message);
};

export { handleClientError };
