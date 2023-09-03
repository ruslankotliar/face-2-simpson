'use client';

import { FC } from 'react';
import moment from 'moment';

import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

import { PredictionTimeChartData } from '@app/_types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

interface PredictionTimeChartProps {
  data: PredictionTimeChartData[];
}

const PredictionTimeChart: FC<PredictionTimeChartProps> = async function ({
  data,
}) {
  const chartData = {
    labels: data.map((item) => moment(item.createdAt).format('YYYY-MM-DD')),
    datasets: [
      {
        label: 'Prediction Time',
        data: data.map((item) => item.predictionTime),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Average Prediction Time',
      },
      tooltip: {
        mode: 'index',
        callbacks: {
          label: function (context) {
            var label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2) + 'ms'; // Assuming prediction time is in milliseconds
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          parser: 'YYYY-MM-DD',
          unit: 'day',
          displayFormats: {
            day: 'MMM DD',
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Time (ms)', // Assuming prediction time is in milliseconds
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return value + 'ms'; // Assuming prediction time is in milliseconds
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.25, // This makes the line smoother. Set to 0 if you want to keep it straight
      },
    },
    animation: {
      duration: 500,
      easing: 'easeInOutQuad',
      onComplete: function (animation) {
        // Callbacks after animations can be useful, for example, to show data annotations
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default PredictionTimeChart;
