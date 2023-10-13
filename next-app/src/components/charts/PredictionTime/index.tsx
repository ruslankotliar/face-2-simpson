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
  ChartData
} from 'chart.js';
import SelectInput from '@src/components/inputs/SelectInput';
import {
  PREDICTION_TIME_CHART_UNITS,
  CHART_STYLES,
  MIN_BIN_GROUP,
  MAX_BIN_GROUP,
  MIN_BIN_IS_TOOLTIP_VISIBLE
} from '@src/constants';
import { generateFetchURL, capitalizeWord } from '@src/helpers';
import { SimpsonCharacter, TimeUnit } from '@src/types';
import formatCharacterName from '@src/helpers/formatCharacterName';
import SliderInput from '@src/components/inputs/SliderInput';
import useThrottle from '@src/hooks/useThrottle';

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

    return chartData;
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const PredictionTimeChart = function () {
  const [dateFormat, setDateFormat] = useState<string>('MMM DD, YYYY');
  const [data, setData] = useState<[string, PredictionTimePoint[]][] | undefined>(undefined);
  const [unit, setUnit] = useState<TimeUnit>(PREDICTION_TIME_CHART_UNITS.DAY as TimeUnit);
  const [bin, setBin] = useState<number>(1);
  const throttledBin = useThrottle<number>(bin, 500);

  const updateData = async function () {
    const res: Record<string, PredictionTimePoint[]> = await getChartData(
      generateFetchURL('PREDICTION_TIME_CHART', {}, { unit, bin })
    );

    const newDateFormat = getDateFormatByUnit(unit);
    setDateFormat(newDateFormat);

    const modifiedResponse: [string, PredictionTimePoint[]][] = Object.entries(res).map(
      ([char, charData]) => [
        formatCharacterName(char as SimpsonCharacter),
        charData.map(({ createdAt, predictionTime }) => ({
          createdAt: dayjs(createdAt).format(newDateFormat),
          predictionTime
        }))
      ]
    );
    setData(modifiedResponse);
  };

  const handleChangeUnit = function (unit: TimeUnit) {
    setUnit(unit);
    setBin(1);
  };

  const handleChangeBin = function (bin: number) {
    setBin(bin);
  };

  useEffect(() => {
    updateData();
  }, [unit, throttledBin]);

  function getDateFormatByUnit(unit: TimeUnit): string {
    switch (unit) {
      default:
      case PREDICTION_TIME_CHART_UNITS.DAY:
        return 'MMM DD, YYYY';
      case PREDICTION_TIME_CHART_UNITS.MONTH:
        return 'MMM YYYY';
      case PREDICTION_TIME_CHART_UNITS.YEAR:
        return 'YYYY';
    }
  }

  function getScaleOptionsByUnit(unit: TimeUnit): ScaleOptions {
    switch (unit) {
      default:
      case PREDICTION_TIME_CHART_UNITS.DAY:
        return {
          unit: 'day',
          displayFormats: {
            day: 'MMM DD'
          }
        };
      case PREDICTION_TIME_CHART_UNITS.MONTH:
        return {
          unit: 'month',
          displayFormats: {
            month: 'MMM YYYY'
          }
        };
      case PREDICTION_TIME_CHART_UNITS.YEAR:
        return {
          unit: 'year',
          displayFormats: {
            year: 'YYYY'
          }
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
            yAxisKey: 'predictionTime'
          },
          fill: false,
          borderColor: CHART_STYLES.PREDICTION_TIME.CHART_COLORS[index],
          borderWidth: 2,
          pointRadius: bin < MIN_BIN_IS_TOOLTIP_VISIBLE ? 0 : 3,
          pointHoverRadius: 5
        }))
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: CHART_STYLES.DEFAULT.SOFTENED_COLOR // Softened color
        }
      },
      title: {
        display: true,
        text: 'Average Prediction Time',
        color: CHART_STYLES.DEFAULT.SOFTENED_COLOR // Softened color
      },
      tooltip: {
        enabled: bin < MIN_BIN_IS_TOOLTIP_VISIBLE ? false : true,
        mode: 'point',
        callbacks: {
          title: function (tooltipItems) {
            const timestamp = tooltipItems[0].label;
            return dayjs(timestamp).format(dateFormat);
          },
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2) + 'ms';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'timeseries',
        time: {
          parser: dateFormat,
          ...getScaleOptionsByUnit(unit)
        },
        grid: {
          color: CHART_STYLES.DEFAULT.GRID_COLOR
        },
        ticks: {
          minRotation: 5,
          maxRotation: 15
        }
      },
      y: {
        grace: '5%',
        // stacked: true,
        title: {
          display: true,
          text: 'Time (ms)',
          color: CHART_STYLES.DEFAULT.SOFTENED_COLOR // Softened color
        },
        ticks: {
          color: CHART_STYLES.DEFAULT.SOFTENED_COLOR, // Softened color
          callback: function (value: number | string) {
            return value + 'ms';
          }
        },
        grid: {
          color: CHART_STYLES.DEFAULT.GRID_COLOR
        }
      }
    },
    elements: {
      line: {
        tension: 0.25,
        spanGaps: false
      },
      point: {
        backgroundColor: CHART_STYLES.PREDICTION_TIME.CHART_COLOR
      }
    },
    animation: {
      duration: 500,
      easing: 'easeInOutQuad'
    }
  };

  return (
    <>
      <div
        className={'absolute top-0 left-0 w-full z-10 flex justify-between items-center md:px-6'}
      >
        <div className="flex-1 flex justify-start">
          <SelectInput
            value={unit}
            onChange={(value) => handleChangeUnit(value as TimeUnit)}
            options={Object.values(PREDICTION_TIME_CHART_UNITS).map((unit) => ({
              value: unit,
              label: capitalizeWord(unit)
            }))}
          />
        </div>
        <div className="flex-1 flex justify-end">
          <SliderInput
            value={bin}
            unit={unit}
            min={MIN_BIN_GROUP}
            max={MAX_BIN_GROUP[unit]}
            onChange={(value) => handleChangeBin(value)}
          />
        </div>
      </div>
      <Line data={chartData} options={options} style={{ zIndex: '1' }} />
    </>
  );
};

export default PredictionTimeChart;
