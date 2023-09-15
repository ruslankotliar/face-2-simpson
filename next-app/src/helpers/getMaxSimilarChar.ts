import { SimpsonCharacter } from '@src/types';

export const getMaxSimilarChar = function (
  data: Record<SimpsonCharacter, number>
): SimpsonCharacter {
  return Object.entries(data).reduce(
    (max, [key, value]) =>
      Math.max(data[max], value) === data[max]
        ? max
        : (key as SimpsonCharacter),
    '' as SimpsonCharacter
  );
};
