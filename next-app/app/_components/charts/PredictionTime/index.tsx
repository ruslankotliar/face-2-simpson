'use client';

import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeSeriesScale,
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
  TimeSeriesScale,
  Title,
  Tooltip,
  Legend
);

import { CHART_STYLES, PREDICTION_TIME_CHART_UNITS } from '@app/_constants';
import { TimeUnit } from '@app/_types';

import { capitalizeWord, generateFetchURL } from '@app/_helpers';
import SelectInput from '@app/_components/inputs/SelectInput';

interface ScaleOptions {
  unit: 'day' | 'month' | 'year' | 'minute';
  displayFormats: {
    day?: string;
    month?: string;
    year?: string;
    minute?: string;
  };
}

interface PredictionTimePoint {
  createdAt: string;
  predictionTime: number;
}

const getChartData = async function (url: string) {
  try {
    const res = await fetch(url);
    const { chartData } = await res.json();

    console.log(chartData);

    return chartData;
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const PredictionTimeChart = function () {
  const [data, setData] = useState<
    [string, PredictionTimePoint[]][] | undefined
  >(undefined);
  const [unit, setUnit] = useState<TimeUnit>(undefined);
  const dateFormat = getDateFormatByUnit(unit);

  const updateData = async function () {
    const res: Record<string, PredictionTimePoint[]> = await getChartData(
      generateFetchURL('PREDICTION_TIME_CHART', {}, { unit })
    );

    const modifiedResponse: [string, PredictionTimePoint[]][] = Object.entries(
      res
    ).map(([char, charData]) => [
      char
        .split('_')
        .map((w) => capitalizeWord(w))
        .join(' '),
      charData.map(({ createdAt, predictionTime }) => ({
        createdAt: dayjs(createdAt).format(dateFormat),
        predictionTime,
      })),
    ]);

    setData(modifiedResponse);
  };

  useEffect(() => {
    updateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          unit: 'minute',
          displayFormats: {
            minute: 'lll',
          },
        };
    }
  }

  const chartData: ChartData<'line', PredictionTimePoint[]> = {
    labels: !data?.length ? [] : data[0][1].map(({ createdAt }) => createdAt),
    datasets: !data
      ? []
      : data.map(([label, data], index) => ({
          label,
          data,
          parsing: {
            xAxisKey: 'createdAt',
            yAxisKey: 'predictionTime',
          },
          fill: false,
          borderColor: CHART_STYLES.PREDICTION_TIME.CHART_COLORS[index],
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
        })),
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
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
        mode: 'point',
        callbacks: {
          title: function (tooltipItems) {
            const timestamp = tooltipItems[0].label;
            return dayjs(timestamp).format(dateFormat);
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
        type: 'timeseries',
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
        spanGaps: false,
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
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '25%',
          zIndex: '2',
        }}
      />
      <Line data={chartData} options={options} style={{ zIndex: '1' }} />
    </>
  );
};

export default PredictionTimeChart;
