interface PredictionTimeChartData {
  createdAt: string;
  predictionTime: number;
}

interface ChartsData {
  predictionTime: PredictionTimeChartData[];
}

export type { PredictionTimeChartData, ChartsData };
