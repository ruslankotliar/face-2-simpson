interface PredictionTimeChartData {
  date: string;
  predictionTime: number;
}

interface ChartsData {
  predictionTime: PredictionTimeChartData[];
}

export type { PredictionTimeChartData, ChartsData };
