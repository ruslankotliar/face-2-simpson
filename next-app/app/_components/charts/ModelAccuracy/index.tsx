import { generateFetchURL } from '@app/_helpers';
import LineChart from './LineChart';

const getChartData = async function (url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const { chartData } = await res.json();

    return chartData;
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const ModelAccuracyChart = async function () {
  const data = await getChartData(
    generateFetchURL('MODEL_ACCURACY_CHART', {}, {})
  );

  return <LineChart data={data} />;
};

export default ModelAccuracyChart;
