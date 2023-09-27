import { FC, ChangeEvent } from 'react';

import { akbar } from '@src/app/fonts';
import styles from './styles.module.css';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const CheckboxInput: FC<CheckboxProps> = function ({
  label,
  checked,
  onChange,
}) {
  return (
    <div
      className={`flex flex-row justify-between gap-4 items-start md:items-center w-fit`}
    >
      <div className={styles['checkbox-wrapper-63']}>
        <label className={styles['switch']}>
          <input
            id='data-can-be-stored'
            checked={checked}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(e.target.checked)
            }
            type='checkbox'
          />
          <span className={styles['slider']}></span>
        </label>
      </div>

      <label
        htmlFor='data-can-be-stored'
        className={`${akbar.className} text-base md:ml-2`}
      >
        {label}
      </label>
    </div>
  );
};

export default CheckboxInput;
