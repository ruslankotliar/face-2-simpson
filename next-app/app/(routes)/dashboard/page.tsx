import axios from 'axios';
import { Suspense } from 'react';

import Loader from '@app/_components/misc/Loader';

import CharacterPredictionChart from '@app/_components/charts/CharacterPredicted';
import PredictionTimeChart from '@app/_components/charts/PredictionTime';

import { generateFetchURL } from '@app/_helpers';

const getChartData = async function (url: string) {
  try {
    const {
      data: { chartData },
    } = await axios.get(url);

    return chartData;
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

export default async function Dashboard({
  searchParams: { timePredictionUnit },
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const predictionTime = await (async () => {
    const key = 'PREDICTION_TIME_CHART';
    const url = generateFetchURL(
      key,
      { unit: timePredictionUnit?.toString() },
      {}
    );
    const data = await getChartData(url);
    const chart = <PredictionTimeChart data={data} />;
    const occupy = 2;

    return {
      key,
      chart,
      occupy,
    };
  })();

  const characterPredicted = await (async () => {
    const key = 'CHARACTER_PREDICTED_CHART';
    const url = generateFetchURL(key, {}, {});
    const data = await getChartData(url);
    const chart = <CharacterPredictionChart data={data} />;
    const occupy = 1;

    return {
      key,
      chart,
      occupy,
    };
  })();

  const charts = [predictionTime, characterPredicted];

  return (
    <div className='min-h-[calc(100vh-3rem)] bg-white p-4 grid grid-cols-3 grid-rows-2 gap-4'>
      {charts.map(({ key, chart, occupy }) => (
        <div
          key={key}
          className={`relative flex-col items-center justify-center rounded-md shadow-lg col-span-${occupy}`}
        >
          <Suspense
            fallback={
              <Loader
                width='100'
                height='100'
                wrapperClass='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'
              />
            }
          >
            {chart}
          </Suspense>
        </div>
      ))}
    </div>
  );
}
