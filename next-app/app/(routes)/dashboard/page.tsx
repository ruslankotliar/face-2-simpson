import axios from 'axios';

import PredictionTimeChart from '@app/_components/charts/PredictionTime';
import { REQUEST_URL_KEYS } from '@app/_constants';
import { ChartsData } from '@app/_types';
import { Suspense } from 'react';

const getChartsData = async function () {
  try {
    const { data } = await axios.get(REQUEST_URL_KEYS.CHARTS);

    console.log(data);

    return data;
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

export default async function Dashboard() {
  const { predictionTime }: ChartsData = await getChartsData();

  return (
    <div className='min-h-[calc(100vh-3rem)] bg-white p-4'>
      <div className='w-[calc(50%)] border border-1 p-4'>
        <Suspense>
          <PredictionTimeChart data={predictionTime} />
        </Suspense>
      </div>
    </div>
  );
}
