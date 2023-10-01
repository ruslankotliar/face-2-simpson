import { roboto } from '@src/app/fonts';
import { FC } from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectInputProps {
  options: Option[];
  value?: string | number;
  onChange: (value: string) => void;
}

const SelectInput: FC<SelectInputProps> = function ({ options, value, onChange }) {
  return (
    <div className="flex gap-2 items-center md:justify-start">
      <label
        htmlFor="time-unit-selector"
        className={`${roboto.className} hidden md:block w-fit text-xs text-right md:text-base font-medium text-black`}
      >
        Time Unit:
      </label>
      <select
        id="time-unit-selector"
        value={value}
        onChange={(e) => onChange(e.target.value.toString())}
        className={`${roboto.className} text-sm md:text-base block text-black bg-white border border-gray-300 hover:border-gray-400 px-2 md:px-4 py-1 md:py-2 pr-4 md:pr-8 rounded-lg shadow-md leading-tight focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition ease-in-out duration-150 w-20 md:w-28 appearance-none`}
      >
        {options.map((option, idx) => (
          <option
            key={`${option.value}${idx}${option.label}`}
            value={option.value}
            className={`${roboto.className}`}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
