import React from 'react';
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
  useWatch,
  Control,
} from 'react-hook-form';
import { LucideIcon } from 'lucide-react';

interface FormTextareaProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  control: Control<T>;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  maxLength?: number;
  showCounter?: boolean;
  icon?: LucideIcon;
  helpText?: string;
}

const FormTextarea = <T extends FieldValues>({
  label,
  name,
  register,
  errors,
  control,
  required = false,
  rows = 3,
  placeholder,
  maxLength,
  showCounter = false,
  icon: Icon,
  helpText,
}: FormTextareaProps<T>) => {
  const value = useWatch<T>({
    control,
    name,
  });

  const error = errors[name];

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>

        {showCounter && maxLength && (
          <span className="text-xs text-gray-500">
            {String(value ?? '').length}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative">
        {Icon && (
          <div className="absolute top-3 left-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}

        <textarea
          id={name}
          {...register(name, {
            required: required ? `${label} is required` : false,
            maxLength: maxLength
              ? {
                  value: maxLength,
                  message: `Cannot exceed ${maxLength} characters`,
                }
              : undefined,
          })}
          rows={rows}
          maxLength={maxLength}
          className={`block w-full ${
            Icon ? 'pl-10' : 'pl-3'
          } pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={placeholder}
        />
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

export default FormTextarea;
