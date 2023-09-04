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

const PredictionTimeChart: FC<PredictionTimeChartProps> = function ({ data }) {
  const chartData = {
    labels: data.map(({ date }) => moment(date).format('YYYY-MM-DD')),
    datasets: [
      {
        label: 'Prediction Time',
        data: data.map((item) => item.predictionTime),
        fill: false,
        borderColor: 'rgba(93, 156, 236, 1)', // Updated color for a modern look
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
        labels: {
          color: 'rgba(55, 65, 81, 1)', // Softened color
        },
      },
      title: {
        display: true,
        text: 'Average Prediction Time',
        color: 'rgba(55, 65, 81, 1)', // Softened color
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
              label += context.parsed.y.toFixed(2) + 'ms';
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
        grid: {
          color: 'rgba(229, 231, 235, 1)', // Softened color
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Time (ms)',
          color: 'rgba(55, 65, 81, 1)', // Softened color
        },
        ticks: {
          callback: function (value) {
            return value + 'ms';
          },
          color: 'rgba(55, 65, 81, 1)', // Softened color
        },
        grid: {
          color: 'rgba(229, 231, 235, 1)', // Softened color
        },
      },
    },
    elements: {
      line: {
        tension: 0.25,
      },
      point: {
        backgroundColor: 'rgba(93, 156, 236, 1)', // Updated color for a modern look
      },
    },
    animation: {
      duration: 500,
      easing: 'easeInOutQuad',
    },
  };

  return (
    <Line data={chartData} options={options} className='rounded-md shadow-lg' />
  );
};

export default PredictionTimeChart;
