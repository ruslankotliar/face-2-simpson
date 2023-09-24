import { SimpsonCharacter, StringArrayMap } from '@src/types';

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

const ALERT_TIMEOUT = 4000;
const HOMER_RUN_TIMEOUT = 2500;
const ASK_FEEDBACK_TIMEOUT = 4000;
const DISPLAY_SPEECH_BUBBLE_TIMEOUT = 4500;
const SET_DEFAULT_USER_FEEDBACK_TIMEOUT = 9000;

const DEFAULT_PREDICTION_DATA: Record<SimpsonCharacter, number> = {
  lisa_simpson: 0,
  bart_simpson: 0,
  homer_simpson: 0,
  marge_simpson: 0,
};

const FORM_KEYS = {
  PERSON_IMG: 'personImg',
};

export {
  FORM_CONSTANTS,
  VALID_FILE_EXTENSIONS,
  PREDICTION_TIME_CHART_UNITS,
  FILENAME_KEYS,
  ALERT_TIMEOUT,
  FORM_KEYS,
  HOMER_RUN_TIMEOUT,
  DEFAULT_PREDICTION_DATA,
  ASK_FEEDBACK_TIMEOUT,
  DISPLAY_SPEECH_BUBBLE_TIMEOUT,
  SET_DEFAULT_USER_FEEDBACK_TIMEOUT,
};
