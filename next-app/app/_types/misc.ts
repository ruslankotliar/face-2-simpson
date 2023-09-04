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

export type { StringMap, StringArrayMap, PredictSimpsonData, NumberMap };
