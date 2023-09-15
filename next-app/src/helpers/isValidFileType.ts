import { VALID_FILE_EXTENSIONS } from '../constants';

const isValidFileType = (fileName: string, fileType: string): boolean =>
  !!fileName &&
  VALID_FILE_EXTENSIONS[fileType].indexOf(fileName.split('.').pop() || '') > -1;

export { isValidFileType };
