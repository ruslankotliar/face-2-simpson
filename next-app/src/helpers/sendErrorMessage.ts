import { DEFAULT_ERROR_MESSAGE } from '@src/constants';

const sendErrorMessage = (message: any) =>
  typeof message === 'string' ? message : DEFAULT_ERROR_MESSAGE;

export default sendErrorMessage;
