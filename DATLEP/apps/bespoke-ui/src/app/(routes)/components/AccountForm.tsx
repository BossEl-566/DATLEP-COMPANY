'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Scissors,
  Shirt,
  Diamond,
  User
} from 'lucide-react';
import { BespokeFormData, BespokeSpecialization } from './types';

interface AccountFormProps {
  specializations: Array<{
    id: BespokeSpecialization;
    label: string;
    icon: any;
    description: string;
  }>;
  africanCountries: Array<{
    code: string;
    name: string;
    phoneCode: string;
  }>;
  selectedCountry: string;
  onCountryChange: (countryCode: string) => void;
  onSubmit: (data: Partial<BespokeFormData>) => void;
  isSubmitting?: boolean;
  formError?: string;
}

const AccountForm: React.FC<AccountFormProps> = ({
  specializations,
  africanCountries,
  selectedCountry,
  onCountryChange,
  onSubmit,
  isSubmitting = false,
  formError
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
  } = useForm<Partial<BespokeFormData>>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      country: 'NG',
      city: '',
      specialization: 'tailor',
      termsAccepted: false,
    },
  });

  const name = watch('name');
  const email = watch('email');
  const password = watch('password');
  const specialization = watch('specialization');
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  const nameRegex = /^[A-Za-z\s]+$/; // Basic name validation allowing letters and spaces

  const onFormSubmit: SubmitHandler<Partial<BespokeFormData>> = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <Scissors className="h-5 w-5 text-purple-600 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-purple-800">Step 1: Create Your Creator Account</h4>
              <p className="text-sm text-purple-700 mt-1">
                Start by setting up your basic account. You'll verify your email before building your profile.
              </p>
            </div>
          </div>
        </div>

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              type="text"
              {...register('name', {
                required: 'Full name is required',
                pattern: { 
                  value: nameRegex, 
                  message: 'Name should only contain letters and spaces' 
                },
                minLength: { 
                  value: 2, 
                  message: 'Name must be at least 2 characters' 
                },
                maxLength: { 
                  value: 100, 
                  message: 'Name is too long' 
                }
              })}
              className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } ${name && !errors.name ? 'border-green-300' : ''}`}
              placeholder="Enter your full name"
            />
            {name && !errors.name && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Check className="h-5 w-5 text-green-500" />
              </div>
            )}
            {errors.name && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <X className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.name && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Specialization Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What is your craftsmanship specialty? *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {specializations.map((spec) => {
              const Icon = spec.icon;
              return (
                <label
                  key={spec.id}
                  className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                    specialization === spec.id
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('specialization', { required: true })}
                    value={spec.id}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{spec.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{spec.description}</p>
                    </div>
                  </div>
                  {specialization === spec.id && (
                    <Check className="absolute top-2 right-2 h-5 w-5 text-purple-600" />
                  )}
                </label>
              );
            })}
          </div>
          {errors.specialization && (
            <p className="mt-2 text-sm text-red-600">Please select a specialization</p>
          )}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: emailRegex, message: 'Please enter a valid email address' },
                })}
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } ${email && !errors.email ? 'border-green-300' : ''}`}
                placeholder="your@email.com"
              />
              {email && !errors.email && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              )}
              {errors.email && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <X className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phone"
                type="tel"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: { value: phoneRegex, message: 'Please enter a valid phone number' },
                })}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={africanCountries.find(c => c.code === selectedCountry)?.phoneCode + " XXX XXX XXX"}
              />
            </div>
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="country"
                {...register('country', { required: 'Country is required' })}
                value={selectedCountry}
                onChange={(e) => onCountryChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm appearance-none"
              >
                {africanCountries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.phoneCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="city"
                type="text"
                {...register('city', {
                  required: 'City is required',
                })}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                  errors.city ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Your city"
              />
            </div>
            {errors.city && (
              <p className="mt-2 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start">
          <input
            id="termsAccepted"
            type="checkbox"
            {...register('termsAccepted', {
              required: 'You must accept the terms and conditions',
            })}
            className="h-4 w-4 mt-1 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-700">
            I agree to DATLEP's{' '}
            <a href="/bespoke/terms" className="text-purple-700 hover:text-purple-800">
              Creator Terms
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-purple-700 hover:text-purple-800">
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.termsAccepted && (
          <p className="text-sm text-red-600">{errors.termsAccepted.message}</p>
        )}
      </div>

      {formError && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Registration Error</h3>
              <p className="mt-1 text-sm text-red-700">{formError}</p>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors ${
          !isValid || isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-purple-700 hover:bg-purple-800'
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Creating Account...
          </div>
        ) : (
          'Continue to Email Verification'
        )}
      </button>
    </form>
  );
};

export default AccountForm;