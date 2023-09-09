import { FC, ChangeEvent } from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  style?: Record<string, string | number>;
}

const CheckboxInput: FC<CheckboxProps> = function ({
  label,
  checked,
  onChange,
  style,
}) {
  return (
    <div className='flex items-center space-x-2' style={style}>
      <input
        type='checkbox'
        checked={checked}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.checked)
        }
        className='form-checkbox text-blue-500 h-5 w-5'
      />
      <label className='text-black'>{label}</label>
    </div>
  );
};

export default CheckboxInput;
