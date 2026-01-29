'use client';

import React, { useRef } from 'react';
import {
  Smartphone,
  AlertCircle,
  Clock,
  RefreshCw,
  Timer,
  ArrowLeft,
  Check,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import AccountForm from '../components/AccountForm';
import { BespokeFormData, BespokeSpecialization } from '../components/types';

interface AccountStepperProps {
  specializations?: Array<{
    id: BespokeSpecialization;
    label: string;
    icon: any;
    description: string;
  }>;
  africanCountries?: Array<{
    code: string;
    name: string;
    phoneCode: string;
  }>;
  selectedCountry?: string;
  onCountryChange?: (countryCode: string) => void;
  onSubmit?: (data: Partial<BespokeFormData>) => void;
  isSubmitting?: boolean;
  formError?: string;
  
  // OTP props
  otp?: string[];
  setOtp?: React.Dispatch<React.SetStateAction<string[]>>;
  otpError?: string;
  otpVerified?: boolean;
  isResending?: boolean;
  timer?: number;
  isTimerActive?: boolean;
  userData?: any;
  onOtpSubmit?: (otp: string) => void;
  onResendOtp?: () => void;
  onBack?: () => void;
}

const AccountStepper: React.FC<AccountStepperProps> = ({
  specializations = [],
  africanCountries = [],
  selectedCountry = 'NG',
  onCountryChange = () => {},
  onSubmit = () => {},
  isSubmitting = false,
  formError,
  
  // OTP props
  otp = Array(6).fill(''),
  setOtp = () => {},
  otpError,
  otpVerified = false,
  isResending = false,
  timer = 60,
  isTimerActive = true,
  userData,
  onOtpSubmit = () => {},
  onResendOtp = () => {},
  onBack = () => {}
}) => {
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // If we're in OTP verification mode
  if (otp.length > 0 && userData) {
    const handleOtpChange = (index: number, value: string) => {
      if (!/^\d?$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }

      if (newOtp.every(digit => digit !== '')) {
        onOtpSubmit(newOtp.join(''));
      }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
            <Smartphone className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Verify Your Email</h3>
          <p className="text-sm text-gray-600">
            We've sent a 6-digit OTP to:
            <br />
            <span className="font-medium text-gray-900">{userData?.email}</span>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Enter 6-digit OTP
          </label>
          <div className="flex justify-between gap-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { otpInputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                disabled={otpVerified || isSubmitting}
                className={`w-full h-14 text-center text-2xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  otpVerified
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <Timer className="h-4 w-4 text-gray-500 mr-1" />
              <span className={`text-sm ${isTimerActive ? 'text-amber-600' : 'text-gray-500'}`}>
                {isTimerActive 
                  ? `Resend available in ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`
                  : 'You can now resend OTP'
                }
              </span>
            </div>
            
            <button
              type="button"
              onClick={onResendOtp}
              disabled={isTimerActive || isResending || otpVerified || isSubmitting}
              className={`text-sm font-medium flex items-center ${
                isTimerActive || isResending || otpVerified || isSubmitting
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-purple-700 hover:text-purple-800'
              }`}
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  Resending...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Resend OTP
                </>
              )}
            </button>
          </div>

          {otpError && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-700">{otpError}</p>
              </div>
            </div>
          )}

          {otpVerified && (
            <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-400 mr-2" />
                <p className="text-sm text-green-700">
                  Email verified successfully! Setting up your creator account...
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting || otpVerified}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Account Details
        </button>
      </div>
    );
  }

  // Regular account form
  return (
    <AccountForm
      specializations={specializations}
      africanCountries={africanCountries}
      selectedCountry={selectedCountry}
      onCountryChange={onCountryChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      formError={formError}
    />
  );
};

export default AccountStepper;