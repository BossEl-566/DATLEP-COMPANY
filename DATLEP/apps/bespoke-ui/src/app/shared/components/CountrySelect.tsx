// shared/components/CountrySelect.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  phoneCode: string;
}

interface CountrySelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  countries: Country[];
  icon?: LucideIcon;
  required?: boolean;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  label,
  name,
  value,
  onChange,
  countries,
  icon: Icon,
  required = false
}) => {
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm appearance-none`}
          required={required}
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name} ({country.phoneCode})
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CountrySelect;