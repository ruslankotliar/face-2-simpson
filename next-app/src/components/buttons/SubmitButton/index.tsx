import { FC } from 'react';
import styles from './styles.module.css';

interface SubmitButtonProps {
  isDisabled: boolean;
}

const SubmitButton: FC<SubmitButtonProps> = function ({ isDisabled }) {
  return (
    <div className='flex items-center justify-end'>
      <button
        type='submit'
        className={styles['submit-button']}
        role='button'
        disabled={isDisabled}
      >
        Predict
      </button>
    </div>
  );
};

export default SubmitButton;
