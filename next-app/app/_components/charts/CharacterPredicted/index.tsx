'use client';

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
  ArcElement,
  ChartOptions,
} from 'chart.js';
import { CHART_STYLES } from '@app/_constants';
import { capitalizeWord } from '@app/_helpers';

interface CharacterPredictionChartData {
  _id: string; // This is the characterPredicted
  count: number;
}

ChartJS.register(CategoryScale, Tooltip, Legend, Title, ArcElement);

const CharacterPredictionChart = function ({
  data,
}: {
  data: CharacterPredictionChartData[];
}) {
  const chartData = {
    labels: data?.map(({ _id }) =>
      _id
        .split('_')
        .map((w) => capitalizeWord(w))
        .join('')
    ),
    datasets: [
      {
        label: 'Times Predicted',
        data: data?.map(({ count }) => count),
        backgroundColor: [
          // Add as many colors as you think you might need, or create a dynamic color generator.
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: CHART_STYLES.SOFTENED_COLOR,
        },
      },
      title: {
        display: true,
        text: 'Predicted Simpsons Characters Distribution',
        color: CHART_STYLES.SOFTENED_COLOR,
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default CharacterPredictionChart;
