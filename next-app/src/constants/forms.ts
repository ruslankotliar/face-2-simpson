import { StringArrayMap } from '@src/types';

const FORM_CONSTANTS = {
  MAX_PERSON_IMG_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ACCEPT_PERSON_IMG_EXTENSIONS: '.jpeg, .png',
};

const VALID_FILE_EXTENSIONS: StringArrayMap = {
  personImg: ['png', 'jpeg', 'jpg'],
};

const FILENAME_KEYS = {
  PURPOSE: {
    TRAIN: 'train',
    TEST: 'test',
  },
};

const PREDICTION_TIME_CHART_UNITS = {
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year',
};

export {
  FORM_CONSTANTS,
  VALID_FILE_EXTENSIONS,
  PREDICTION_TIME_CHART_UNITS,
  FILENAME_KEYS,
};
