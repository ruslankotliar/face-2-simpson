import styles from './styles.module.css';

const SubmitButton = function () {
  return (
    <div className='flex items-center justify-end'>
      <button type='submit' className={styles['submit-button']} role='button'>
        Predict
      </button>
    </div>
  );
};

export default SubmitButton;
