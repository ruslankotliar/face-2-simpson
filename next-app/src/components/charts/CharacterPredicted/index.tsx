import { generateFetchURL } from '@src/helpers';
import PieChart from './PieChart';

const getChartData = async function (url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 30 } });
    const { chartData } = await res.json();

    return chartData;
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const CharacterPredictionChart = async function () {
  const data = await getChartData(
    generateFetchURL('CHARACTER_PREDICTED_CHART', {}, {})
  );

  return <PieChart data={data} />;
};

export default CharacterPredictionChart;
