import CharacterPredictionChart from '@src/components/charts/CharacterPredicted';
import ModelAccuracyChart from '@src/components/charts/ModelAccuracy';
import PredictionTimeChart from '@src/components/charts/PredictionTime';

export default async function Dashboard() {
  return (
    <div className="md:h-[calc(100vh-5rem)] h-[calc(140vh-3.5rem)] w-screen bg-white p-1 flex flex-col md:grid md:grid-cols-3 md:grid-rows-2 gap-2 md:gap-4">
      {/* Mobile PredictionTimeChart */}
      <div className={'block md:hidden rounded-sm shadow-md relative flex-1'}>
        <PredictionTimeChart />
      </div>
      <div className={'rounded-sm shadow-md md:rounded-md md:shadow-lg md:col-span-1 flex-1'}>
        <CharacterPredictionChart />
      </div>
      <div className={'rounded-sm shadow-md md:rounded-md md:shadow-lg md:col-span-2 flex-1'}>
        <ModelAccuracyChart />
      </div>
      {/* Desktop PredictionTimeChart */}
      <div className={'hidden md:block rounded-md shadow-lg col-span-3 relative max-h-full'}>
        <PredictionTimeChart />
      </div>
    </div>
  );
}
