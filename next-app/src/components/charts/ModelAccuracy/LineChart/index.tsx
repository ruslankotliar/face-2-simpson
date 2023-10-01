'use client';

import dayjs from 'dayjs';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';

import { Line } from 'react-chartjs-2';

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
  ChartData
} from 'chart.js';
import { CHART_STYLES } from '@src/constants';

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

interface ModelAccuracyPoint {
  createdAt: string;
  accuracy: number;
}

const LineChart = function ({ data }: { data: ModelAccuracyPoint[] }) {
  const dateFormat = 'lll';

  const chartData: ChartData<'line'> = {
    labels: data?.map(({ createdAt }) => dayjs(createdAt).format(dateFormat)),
    datasets: [
      {
        label: 'Model Accuracy',
        data: data?.map(({ accuracy }) => accuracy * 100),
        fill: false,
        borderColor: CHART_STYLES.MODEL_ACCURACY.CHART_COLOR,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'top',
        labels: {
          color: CHART_STYLES.DEFAULT.SOFTENED_COLOR // Softened color
        }
      },
      title: {
        display: true,
        text: 'Model Accuracy',
        color: CHART_STYLES.DEFAULT.SOFTENED_COLOR // Softened color
      },
      tooltip: {
        mode: 'index'
      }
    },
    scales: {
      x: {
        type: 'timeseries',
        time: {
          parser: dateFormat,
          unit: 'day',
          displayFormats: {
            day: 'MMM DD'
          }
        },
        grid: {
          color: CHART_STYLES.DEFAULT.GRID_COLOR
        }
      },
      y: {
        grace: '1%',
        title: {
          display: true,
          text: 'Accuracy (%)',
          color: CHART_STYLES.DEFAULT.SOFTENED_COLOR // Softened color
        },
        ticks: {
          color: CHART_STYLES.DEFAULT.SOFTENED_COLOR, // Softened color,
          callback: function (value: number | string) {
            return value + '%';
          }
        },
        grid: {
          color: CHART_STYLES.DEFAULT.GRID_COLOR
        }
      }
    },
    elements: {
      line: {
        tension: 0.25
      },
      point: {
        backgroundColor: CHART_STYLES.MODEL_ACCURACY.CHART_COLOR // Updated color for a modern look
      }
    },
    animation: {
      duration: 500,
      easing: 'easeInOutQuad'
    }
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
