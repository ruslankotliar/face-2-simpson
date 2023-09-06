/* eslint-disable react-hooks/exhaustive-deps */
'use client';

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

import { CHART_STYLES } from '@app/_constants';

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

interface ModelAccuracyChartData {
  createdAt: string;
  accuracy: number;
}

const ModelAccuracyChart = async function ({
  data,
}: {
  data: ModelAccuracyChartData[];
}) {
  const chartData = {
    labels: data?.map(({ createdAt }) => moment.utc(createdAt).format('lll')),
    datasets: [
      {
        label: 'Model Accuracy',
        data: data?.map(({ accuracy }) => accuracy * 100),
        fill: false,
        borderColor: CHART_STYLES.MODEL_ACCURACY.CHART_COLOR,
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
        display: false,
        position: 'top',
        labels: {
          color: CHART_STYLES.DEFAULT.SOFTENED_COLOR, // Softened color
        },
      },
      title: {
        display: true,
        text: 'Model Accuracy',
        color: CHART_STYLES.DEFAULT.SOFTENED_COLOR, // Softened color
      },
      tooltip: {
        mode: 'index',
        callbacks: {
          title: function (tooltipItems) {
            const timestamp = tooltipItems[0].label;
            return moment.utc(timestamp).format('lll');
          },
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
          parser: 'lll',
          unit: 'day',
          displayFormats: {
            day: 'MMM DD',
          },
        },
        grid: {
          color: CHART_STYLES.DEFAULT.GRID_COLOR,
        },
      },
      y: {
        grace: '1%',
        title: {
          display: true,
          text: 'Accuracy (%)',
          color: CHART_STYLES.DEFAULT.SOFTENED_COLOR, // Softened color
        },
        ticks: {
          callback: function (value) {
            return value + '%';
          },
          color: CHART_STYLES.DEFAULT.SOFTENED_COLOR, // Softened color
        },
        grid: {
          color: CHART_STYLES.DEFAULT.GRID_COLOR,
        },
      },
    },
    elements: {
      line: {
        tension: 0.25,
      },
      point: {
        backgroundColor: CHART_STYLES.MODEL_ACCURACY.CHART_COLOR, // Updated color for a modern look
      },
    },
    animation: {
      duration: 500,
      easing: 'easeInOutQuad',
    },
  };

  return (
    <>
      <Line data={chartData} options={options} />
    </>
  );
};

export default ModelAccuracyChart;
