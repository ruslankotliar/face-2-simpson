import { StaticImageData } from 'next/image';

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
  bin?: number;
};

type RequestSearchParams = {};

type TimeUnit = 'day' | 'month' | 'year';

type SimpsonCharacter = 'bart_simpson' | 'homer_simpson' | 'lisa_simpson' | 'marge_simpson';

// type AlertOptions = 'loading' | 'success' | 'info' | 'error' | 'warn';

enum AlertOptions {
  loading = 'loading',
  success = 'success',
  info = 'info',
  error = 'error',
  warn = 'warn'
}

enum AlertIconKeys {
  homerError = 'homerError'
}

interface DeveloperData {
  img: StaticImageData;
  buttons: { href: string; iconKey: string; newTab: boolean }[];
  name: string;
  position: string;
  area: string[];
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
  DeveloperData
};

export { AlertOptions, AlertIconKeys };
