'use client';

import { CHART_STYLES } from '@app/_constants';
import { capitalizeWord } from '@app/_helpers';

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
  ArcElement,
  ChartOptions,
  ChartData,
} from 'chart.js';

ChartJS.register(CategoryScale, Tooltip, Legend, Title, ArcElement);

interface CharacterPredictionChartData {
  _id: string; // This is the characterPredicted
  count: number;
}

const PieChart = function ({ data }: { data: CharacterPredictionChartData[] }) {
  const chartData: ChartData<'pie'> = {
    labels: data?.map(({ _id }) =>
      _id
        .split('_')
        .map((w) => capitalizeWord(w))
        .join(' ')
    ),
    datasets: [
      {
        label: 'Times Predicted',
        data: data?.map(({ count }) => count),
        backgroundColor: CHART_STYLES.CHARACTER_PREDICTED.BACKGROUND,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as 'top',
        labels: {
          color: CHART_STYLES.DEFAULT.SOFTENED_COLOR,
        },
      },
      title: {
        display: true,
        text: 'Predicted Simpsons Characters Distribution',
        color: CHART_STYLES.DEFAULT.SOFTENED_COLOR,
      },
      tooltip: {
        mode: 'point',
        callbacks: {
          label: function ({ parsed, dataset: { data, label } }) {
            if (label) label += ': ';
            const sum = data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((Number(parsed) / sum) * 100) + '%';
            if (parsed !== null) label += percentage;
            return label;
          },
        },
      },
      // datalabels: {
      //   formatter: (value, ctx) => {
      //     let datasets = ctx.chart.data.datasets;
      //     if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
      //       let sum = datasets[0].data.reduce((a, b) => a + b, 0);
      //       let percentage = Math.round((value / sum) * 100) + '%';
      //       return percentage;
      //     } else {
      //       return percentage;
      //     }
      //   },
      //   color: '#fff',
      // },
    },
  };
  return <Pie data={chartData} options={options} />;
};

export default PieChart;
