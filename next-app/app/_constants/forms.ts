import { StringArrayMap } from '@app/_types';

const FORM_CONSTANTS = {
  MAX_PERSON_IMG_SIZE: '50000000',
  ACCEPT_PERSON_IMG_EXTENSIONS: '.jpeg, .png',
};

const VALID_FILE_EXTENSIONS: StringArrayMap = {
  personImg: ['png', 'jpeg'],
};

const FILENAME_KEYS = {
  PURPOSE: {
    TRAIN: 'train',
    TEST: 'test',
  },
};

const FORM_DATA_KEYS = {
  PREDICTION_IMG: 'predictImg',
  PREDICTION_IMG_BASE64: 'predictImgBase64',
  PREDICTION_RESULT: 'predictionResult',
};

const PREDICTION_TIME_CHART_UNITS = {
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year',
};

export {
  FORM_CONSTANTS,
  VALID_FILE_EXTENSIONS,
  FORM_DATA_KEYS,
  PREDICTION_TIME_CHART_UNITS,
  FILENAME_KEYS,
};
