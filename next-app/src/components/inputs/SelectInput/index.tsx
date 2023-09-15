import { FC } from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectInputProps {
  options: Option[];
  value?: string | number;
  placeholder?: string;
  onChange: (value: string) => void;
  style?: Record<string, string | number>;
}

const SelectInput: FC<SelectInputProps> = function ({
  options,
  value,
  placeholder,
  onChange,
  style,
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value.toString())}
      className={
        'block text-black appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg shadow-md leading-tight focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition ease-in-out duration-150'
      }
      style={style}
    >
      {placeholder && (
        <option value='' disabled selected>
          {placeholder}
        </option>
      )}
      {options.map((option, idx) => (
        <option key={idx} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectInput;
