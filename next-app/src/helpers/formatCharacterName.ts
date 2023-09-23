import { SimpsonCharacter } from '@src/types';
import { capitalizeWord } from './capitalizeWord';

const formatCharacterName = (name: SimpsonCharacter): string =>
  name
    .split('_')
    .map((word) => capitalizeWord(word))
    .join(' ');

export default formatCharacterName;
