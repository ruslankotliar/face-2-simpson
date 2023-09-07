import { StringArrayMap, StringMap } from '../_types';

const FORM_CONSTANTS: StringMap = {
  MAX_PERSON_IMG_SIZE: '50000000',
  ACCEPT_PERSON_IMG_EXTENSIONS: '.jpeg, .png',
};

const VALID_FILE_EXTENSIONS: StringArrayMap = {
  personImg: ['png', 'jpeg'],
};

const BUCKET_KEYS: StringMap = {
  TRAIN: 'train',
  TEST: 'test',
};

const BUCKET_OBJ_TAG_VALUES: StringMap = {
  // simpsons
  BART: 'bart_simpson',
  HOMER: 'homer_simpson',
  LISA: 'lisa_simpson',
  MARGE: 'marge_simpson',
  // purpose
  ...BUCKET_KEYS,
};

const PREDICTION_TIME_CHART_UNITS: StringMap = {
  ALL: 'all',
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year',
};

export {
  FORM_CONSTANTS,
  VALID_FILE_EXTENSIONS,
  BUCKET_KEYS,
  BUCKET_OBJ_TAG_VALUES,
  PREDICTION_TIME_CHART_UNITS,
};
