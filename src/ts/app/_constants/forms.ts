import { StringArrayMap, StringMap } from '../_types';

const FORM_CONSTANTS: StringMap = {
  MAX_PERSON_IMG_SIZE: '50000000',
  ACCEPT_PERSON_IMG_EXTENSIONS: '.jpeg, .png',
};

const VALID_FILE_EXTENSIONS: StringArrayMap = {
  personImg: ['png', 'jpeg'],
};

const PREDICT_SIMP_FILENAME: string = 'predictSimpson';

export { FORM_CONSTANTS, VALID_FILE_EXTENSIONS, PREDICT_SIMP_FILENAME };
