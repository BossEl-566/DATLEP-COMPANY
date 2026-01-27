import React from 'react';
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';

interface FormCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  required?: boolean;
  label: string | React.ReactNode;
  helpText?: string;
}

const FormCheckbox = <T extends FieldValues>({
  name,
  register,
  errors,
  required = false,
  label,
  helpText,
}: FormCheckboxProps<T>) => {
  const error = errors[name];

  return (
    <div>
      <div className="flex items-start">
        <input
          id={name}
          type="checkbox"
          {...register(name, {
            required: required ? 'This field is required' : false,
          })}
          className="h-4 w-4 mt-1 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label htmlFor={name} className="ml-2 block text-sm text-gray-700">
          {label}
        </label>
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

export default FormCheckbox;
