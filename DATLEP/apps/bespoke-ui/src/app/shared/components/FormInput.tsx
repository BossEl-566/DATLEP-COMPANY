import React from 'react';
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';
import { LucideIcon } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  icon?: LucideIcon;
  required?: boolean;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  placeholder?: string;
  validation?: Record<string, any>;
  helpText?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: string;
}

const FormInput = <T extends FieldValues>({
  label,
  name,
  type = 'text',
  register,
  errors,
  icon: Icon,
  required = false,
  showPasswordToggle = false,
  onTogglePassword,
  placeholder,
  validation,
  helpText,
  maxLength,
  min,
  max,
  step,
}: FormInputProps<T>) => {
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

        <input
          id={name}
          type={type}
          {...register(name, validation)}
          className={`block w-full ${
            Icon ? 'pl-10' : 'pl-3'
          } pr-${showPasswordToggle ? '10' : '3'} py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={placeholder}
          maxLength={maxLength}
          min={min}
          max={max}
          step={step}
        />

        {showPasswordToggle && onTogglePassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={onTogglePassword}
          >
            {type === 'password' ? (
              <Eye className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeOff className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
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

export default FormInput;
