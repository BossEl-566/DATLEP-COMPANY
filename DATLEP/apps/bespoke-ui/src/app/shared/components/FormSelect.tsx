import React from 'react';
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';
import { LucideIcon } from 'lucide-react';

interface SelectOption {
  id: string;
  label: string;
  description?: string;
}

interface FormSelectProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  required?: boolean;
  options: SelectOption[];
  icon?: LucideIcon;
  helpText?: string;
}

const FormSelect = <T extends FieldValues>({
  label,
  name,
  register,
  errors,
  required = false,
  options,
  icon: Icon,
  helpText,
}: FormSelectProps<T>) => {
  const error = errors[name];

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}

        <select
          id={name}
          {...register(name, {
            required: required ? `${label} is required` : false,
          })}
          className={`block w-full ${
            Icon ? 'pl-10' : 'pl-3'
          } pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Select an option</option>

          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {error?.message && (
        <p className="mt-2 text-sm text-red-600">
          {String(error.message)}
        </p>
      )}

      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default FormSelect;
