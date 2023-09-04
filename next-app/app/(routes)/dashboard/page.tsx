import axios from 'axios';
import { Suspense } from 'react';

import PredictionTimeChart from '@app/_components/charts/PredictionTime';
import { REQUEST_URL_KEYS } from '@app/_constants';
import Loader from '@app/_components/misc/Loader';

const getPredictionTimeChartData = async function (unit: string | undefined) {
  try {
    const { data } = await axios.get(
      `${REQUEST_URL_KEYS.PREDICTION_TIME_CHART}${unit}`
    );

    console.log(data);

    return data;
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

export default async function Dashboard({
  searchParams: { timePredictionUnit },
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const charts = [
    {
      key: 'predictionTime',
      data: await getPredictionTimeChartData(timePredictionUnit?.toString()),
    },
  ];

  return (
    <div className='min-h-[calc(100vh-3rem)] bg-white p-4 grid grid-cols-2 grid-rows-2 gap-4'>
      {charts.map(({ key, data: { chartData } }) => (
        <div
          key={key}
          className='relative flex-col items-center justify-center'
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
            <PredictionTimeChart data={chartData} />
          </Suspense>
        </div>
      ))}
    </div>
  );
}
