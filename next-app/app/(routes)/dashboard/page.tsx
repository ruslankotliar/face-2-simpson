import CharacterPredictionChart from '@app/_components/charts/CharacterPredicted';
import PredictionTimeChart from '@app/_components/charts/PredictionTime';
import ModelAccuracyChart from '@app/_components/charts/ModelAccuracy';

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
