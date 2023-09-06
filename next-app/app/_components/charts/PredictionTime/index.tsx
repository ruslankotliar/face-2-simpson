/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
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

import SelectInput from '@app/_components/inputs/SelectInput';
import { CHART_STYLES, PREDICTION_TIME_CHART_UNITS } from '@app/_constants';
import useQueryString from '@app/_hooks/useQueryString';
import { capitalizeWord } from '@app/_helpers';

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

interface PredictionTimeChartData {
  createdAt: string;
  predictionTime: number;
}

type TimeUnit = keyof typeof PREDICTION_TIME_CHART_UNITS | undefined;
interface ScaleOptions {
  unit: 'day' | 'month' | 'year';
  displayFormats: {
    day?: string;
    month?: string;
    year?: string;
  };
}

const PredictionTimeChart = async function ({
  data,
}: {
  data: PredictionTimeChartData[];
}) {
  const { createQueryString, updateQueryString } = useQueryString();
  const [unit, setUnit] = useState<TimeUnit | undefined>(undefined);
  const dateFormat = getDateFormatByUnit(unit);

  useEffect(() => {
    if (unit) {
      const path = createQueryString('timePredictionUnit', unit.toString());
      updateQueryString(path);
    }
  }, [unit]);

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

  const chartData = {
    labels: data?.map(({ createdAt }) =>
      moment.utc(createdAt).format(dateFormat)
    ),
    datasets: [
      {
        label: 'Prediction Time',
        data: data?.map(({ predictionTime }) => predictionTime),
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
          callback: function (value) {
            return value + 'ms';
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
        backgroundColor: CHART_STYLES.PREDICTION_TIME.CHART_COLOR, // Updated color for a modern look
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
