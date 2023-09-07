import { PREDICTION_TIME_CHART_UNITS } from '@app/_constants';

interface StringMap {
  [key: string]: string;
}

interface StringArrayMap {
  [key: string]: string[];
}

interface NumberMap {
  [key: string]: number;
}

interface PredictSimpsonData {
  predictData: NumberMap;
  predictTime: number;
  key: string;
}

type RequestParams = {
  unit?: TimeUnit;
};

type RequestSearchParams = {};

type TimeUnit = keyof typeof PREDICTION_TIME_CHART_UNITS | undefined;

export type {
  StringMap,
  StringArrayMap,
  PredictSimpsonData,
  NumberMap,
  RequestParams,
  RequestSearchParams,
  TimeUnit,
};
