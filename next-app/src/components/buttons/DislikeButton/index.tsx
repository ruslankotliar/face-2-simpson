import { ChangeEvent, FC } from 'react';
import styles from './styles.module.css';

import DislikeIcon from '@src/components/icons/Dislike';

interface DislikeButtonProps {
  id: string;
  onClick: (e: ChangeEvent<HTMLInputElement>, value: boolean) => void;
  userFeedback: boolean | null | undefined;
}

const DislikeButton: FC<DislikeButtonProps> = ({
  id,
  onClick,
  userFeedback,
}) => (
  <div className='w-[40px] md:w-[60px] flex items-center justify-center'>
    <input
      type='checkbox'
      id={id}
      checked={userFeedback === false}
      className={styles['checkbox-dislike']}
      onChange={(e) => onClick(e, false)}
    />
    <label htmlFor={id}>
      <DislikeIcon styles={styles} />
    </label>
  </div>
);

export default DislikeButton;
