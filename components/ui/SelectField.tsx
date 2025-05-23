
import React, { ChangeEvent } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
  className = ''
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className="mb-1.5 text-sm font-medium text-sky-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-no-repeat bg-right pr-8"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' class='w-5 h-5'%3E%3Cpath fill-rule='evenodd' d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z' clip-rule='evenodd' /%3E%3C/svg%3E%0A")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.25em 1.25em',
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-700 text-slate-100">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
    