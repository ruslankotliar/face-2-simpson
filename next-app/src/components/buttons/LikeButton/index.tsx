import { FC, MouseEvent } from 'react';
import styles from './styles.module.css';

import LikeIcon from '@src/components/icons/Like';

interface LikeButtonProps {
  id: string;
  isDisabled?: boolean;
  onClick?: (e: MouseEvent<HTMLInputElement>) => void;
}

const LikeButton: FC<LikeButtonProps> = ({ id, isDisabled, onClick }) => (
  <div>
    <input
      type='checkbox'
      id={id}
      className={styles['checkbox']}
      onClick={onClick}
      disabled={isDisabled}
    />
    <label htmlFor={id}>
      <LikeIcon styles={styles} />
    </label>
  </div>
);

export default LikeButton;
