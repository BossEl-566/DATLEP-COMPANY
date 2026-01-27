// shared/components/TimeSelect.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { FieldError } from 'react-hook-form';

interface TimeSelectProps {
  label: string;
  name: string;
  register: any;
  errors: Record<string, FieldError>;
  required?: boolean;
  icon?: LucideIcon;
  helpText?: string;
}

const TimeSelect: React.FC<TimeSelectProps> = ({
  label,
  name,
  register,
  errors,
  required = false,
  icon: Icon,
  helpText
}) => {
  // Generate time options for 24-hour format
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

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
          {...register(name, { required: required ? `${label} is required` : false })}
          className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors[name] ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>
      {errors[name] && (
        <p className="mt-2 text-sm text-red-600">{errors[name].message}</p>
      )}
      {helpText && !errors[name] && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default TimeSelect;