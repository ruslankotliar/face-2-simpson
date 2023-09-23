import { FC, MouseEvent } from 'react';
import styles from './styles.module.css';

import DislikeIcon from '@src/components/icons/Dislike';

interface DislikeButtonProps {
  id: string;
  isDisabled?: boolean;
  onClick?: (e: MouseEvent<HTMLInputElement>) => void;
}

const DislikeButton: FC<DislikeButtonProps> = ({ id, isDisabled, onClick }) => (
  <div className='w-[60px] flex items-center justify-center'>
    <input
      type='checkbox'
      id={id}
      disabled={isDisabled}
      className={styles['checkbox-dislike']}
      onClick={onClick}
    />
    <label htmlFor={id}>
      <DislikeIcon styles={styles} />
    </label>
  </div>
);

export default DislikeButton;
