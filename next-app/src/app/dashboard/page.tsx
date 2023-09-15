import CharacterPredictionChart from '@src/components/charts/CharacterPredicted';
import ModelAccuracyChart from '@src/components/charts/ModelAccuracy';
import PredictionTimeChart from '@src/components/charts/PredictionTime';

export default async function Dashboard() {
  return (
    <div className='h-[calc(100vh-4rem)] w-screen bg-white p-6 grid grid-cols-3 grid-rows-2 gap-4'>
      <div className={'rounded-md shadow-lg col-span-1'}>
        <CharacterPredictionChart />
      </div>
      <div className={'rounded-md shadow-lg col-span-2'}>
        <ModelAccuracyChart />
      </div>
      <div className={'rounded-md shadow-lg col-span-3 relative max-h-full'}>
        <PredictionTimeChart />
      </div>
    </div>
  );
}
