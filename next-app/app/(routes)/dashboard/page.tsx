import CharacterPredictionChart from '@app/_components/charts/CharacterPredicted';
import PredictionTimeChart from '@app/_components/charts/PredictionTime';
import ModelAccuracyChart from '@app/_components/charts/ModelAccuracy';

export default async function Dashboard() {
  console.log('reloading...');

  return (
    <div className='min-h-[calc(100vh-3rem)] bg-white p-4 grid grid-cols-3 grid-rows-2 gap-4'>
      <div className={'rounded-md shadow-lg col-span-1'}>
        <CharacterPredictionChart />
      </div>
      <div className={'rounded-md shadow-lg col-span-2'}>
        <ModelAccuracyChart />
      </div>
      <div className={'rounded-md shadow-lg col-span-2'}>
        <PredictionTimeChart />
      </div>
    </div>
  );
}
