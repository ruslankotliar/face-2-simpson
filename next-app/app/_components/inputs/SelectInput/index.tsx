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
  className?: string;
}

const SelectInput: FC<SelectInputProps> = function ({
  options,
  value,
  placeholder,
  onChange,
  className,
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value.toString())}
      className={`block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline-blue ${className}`}
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
