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
  predictionData: Record<SimpsonCharacter, number>;
  predictionTime: number;
  imageBucketKey: string;
}

interface FeedbackData extends PredictSimpsonData {
  userFeedback: boolean | null;
  permissionToStore: boolean;
}

type RequestParams = {
  unit?: TimeUnit;
};

type RequestSearchParams = {};

type TimeUnit = 'day' | 'month' | 'year';

type SimpsonCharacter =
  | 'bart_simpson'
  | 'homer_simpson'
  | 'lisa_simpson'
  | 'marge_simpson';

// type AlertOptions = 'loading' | 'success' | 'info' | 'error' | 'warn';

enum AlertOptions {
  loading = 'loading',
  success = 'success',
  info = 'info',
  error = 'error',
  warn = 'warn',
}

enum AlertIconKeys {
  homerError = 'homerError',
}

export type {
  StringMap,
  StringArrayMap,
  PredictSimpsonData,
  NumberMap,
  RequestParams,
  RequestSearchParams,
  TimeUnit,
  FeedbackData,
  SimpsonCharacter,
};

export { AlertOptions, AlertIconKeys };
