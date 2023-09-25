import { ChangeEvent, FC } from 'react';
import styles from './styles.module.css';

import LikeIcon from '@src/components/icons/Like';

interface LikeButtonProps {
  id: string;
  onClick: (e: ChangeEvent<HTMLInputElement>, value: boolean) => void;
  userFeedback: boolean | null | undefined;
}

const LikeButton: FC<LikeButtonProps> = ({ id, onClick, userFeedback }) => {
  return (
    <div>
      <input
        type='checkbox'
        id={id}
        checked={userFeedback === true}
        className={styles['checkbox']}
        onChange={(e) => onClick(e, true)}
      />
      <label htmlFor={id}>
        <LikeIcon styles={styles} />
      </label>
    </div>
  );
};

export default LikeButton;
