import LikeIcon from '@src/components/icons/Like';
import styles from './styles.module.css';
import { FC } from 'react';

interface LikeButtonProps {
  id: string;
}

const LikeButton: FC<LikeButtonProps> = ({ id }) => (
  <div>
    <input type='checkbox' id={id} className={styles['checkbox']} />
    <label htmlFor={id}>
      <LikeIcon styles={styles} />
    </label>
  </div>
);

export default LikeButton;
