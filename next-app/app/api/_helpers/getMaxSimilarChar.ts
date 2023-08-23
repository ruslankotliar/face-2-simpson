import { NumberMap } from '@app/_types';

export const getMaxSimilarChar = function (data: NumberMap): string {
  return Object.entries(data).reduce(
    (max, [key, value]) =>
      Math.max(data[max], value) === data[max] ? max : key,
    ''
  );
};
