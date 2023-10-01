import { roboto } from '@src/app/fonts';
import { FC } from 'react';

interface SliderInputProps {
  value?: number;
  onChange: (value: number) => void;
  className?: string;
  min?: number;
  max?: number;
  unit?: string;
}

const SliderInput: FC<SliderInputProps> = function ({
  value,
  onChange,
  className,
  min,
  max,
  unit
}) {
  return (
    <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
      <label
        htmlFor="minmax-range"
        className={`${roboto.className} block text-xs text-right md:text-base font-medium text-black`}
      >
        Group <span className="text-primary">{value}</span> {value === 1 ? unit : `${unit}s`}
      </label>
      <div className="flex items-center justify-center">
        <input
          id="minmax-range"
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          className={`h-1 md:h-2 w-28 md:w-60 bg-gray-200 text-primary rounded-lg appearance-none cursor-pointer accent-orange  ${className}`}
        />
      </div>
    </div>
  );
};

export default SliderInput;
