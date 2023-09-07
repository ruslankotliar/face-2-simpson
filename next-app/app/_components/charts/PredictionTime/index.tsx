'use client';

import moment from 'moment';
import { useEffect, useState } from 'react';

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
  ChartData,
} from 'chart.js';

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

import { CHART_STYLES, PREDICTION_TIME_CHART_UNITS } from '@app/_constants';
import { TimeUnit } from '@app/_types';

import { capitalizeWord, generateFetchURL } from '@app/_helpers';
import SelectInput from '@app/_components/inputs/SelectInput';

interface PredictionTimeChartData {
  createdAt: string;
  predictionTime: number;
}

interface ScaleOptions {
  unit: 'day' | 'month' | 'year';
  displayFormats: {
    day?: string;
    month?: string;
    year?: string;
  };
}

const getChartData = async function (url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 15 } });
    const { chartData } = await res.json();

    return chartData;
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const PredictionTimeChart = function () {
  const [data, setData] = useState<PredictionTimeChartData[]>([]);
  const [unit, setUnit] = useState<TimeUnit>(undefined);

  const updateData = async function () {
    setData(
      await getChartData(
        generateFetchURL('PREDICTION_TIME_CHART', {}, { unit })
      )
    );
  };

  useEffect(() => {
    updateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  const dateFormat = getDateFormatByUnit(unit);

  function getDateFormatByUnit(unit: TimeUnit): string {
    switch (unit) {
      case PREDICTION_TIME_CHART_UNITS.DAY:
        return 'MMM DD, YYYY';
      case PREDICTION_TIME_CHART_UNITS.MONTH:
        return 'MMM YYYY';
      case PREDICTION_TIME_CHART_UNITS.YEAR:
        return 'YYYY';
      case PREDICTION_TIME_CHART_UNITS.ALL:
      default:
        return 'lll';
    }
  }

  function getScaleOptionsByUnit(unit: TimeUnit): ScaleOptions {
    switch (unit) {
      case PREDICTION_TIME_CHART_UNITS.DAY:
        return {
          unit: 'day',
          displayFormats: {
            day: 'MMM DD',
          },
        };
      case PREDICTION_TIME_CHART_UNITS.MONTH:
        return {
          unit: 'month',
          displayFormats: {
            month: 'MMM YYYY',
          },
        };
      case PREDICTION_TIME_CHART_UNITS.YEAR:
        return {
          unit: 'year',
          displayFormats: {
            year: 'YYYY',
          },
        };
      case PREDICTION_TIME_CHART_UNITS.ALL:
      default:
        return {
          unit: 'day',
          displayFormats: {
            day: 'MMM DD',
          },
        };
    }
  }

  const chartData: ChartData<'line'> = {
    labels: data.map(({ createdAt }) =>
      moment.utc(createdAt).format(dateFormat)
    ),
    datasets: [
      {
        label: 'Prediction Time (All Characters)',
        data: data.map(({ predictionTime }) => predictionTime),
        fill: false,
        borderColor: CHART_STYLES.PREDICTION_TIME.CHART_COLOR,
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
          color: CHART_STYLES.DEFAULT.SOFTENED_COLOR, // Softened color
        },
      },
      title: {
        display: true,
        text: 'Average Prediction Time',
        color: CHART_STYLES.DEFAULT.SOFTENED_COLOR, // Softened color
      },
      tooltip: {
        mode: 'index',
        callbacks: {
          title: function (tooltipItems) {
            const timestamp = tooltipItems[0].label;
            return moment.utc(timestamp).format(dateFormat);
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
          parser: dateFormat,
          ...getScaleOptionsByUnit(unit),
        },
        grid: {
          color: CHART_STYLES.DEFAULT.GRID_COLOR,
        },
      },
      y: {
        grace: '5%',
        title: {
          display: true,
          text: 'Time (ms)',
          color: CHART_STYLES.DEFAULT.SOFTENED_COLOR, // Softened color
        },
        ticks: {
          color: CHART_STYLES.DEFAULT.SOFTENED_COLOR, // Softened color
          callback: function (value: number | string) {
            return value + 'ms';
          },
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
        backgroundColor: CHART_STYLES.PREDICTION_TIME.CHART_COLOR,
      },
    },
    animation: {
      duration: 500,
      easing: 'easeInOutQuad',
    },
  };

  return (
    <>
      <SelectInput
        placeholder={'Pick unit of time'}
        value={unit}
        onChange={setUnit}
        options={Object.values(PREDICTION_TIME_CHART_UNITS).map((unit) => ({
          value: unit,
          label: capitalizeWord(unit),
        }))}
      />
      <Line data={chartData} options={options} />
    </>
  );
};

export default PredictionTimeChart;
