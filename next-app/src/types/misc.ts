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
