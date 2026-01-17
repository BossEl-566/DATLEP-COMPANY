"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Shield, 
  Check, 
  X, 
  AlertCircle,
  Clock,
  RefreshCw,
  Timer,
  Smartphone,
  ArrowLeft,
  KeyRound
} from 'lucide-react';
import logo from '@/assets/images/datlep-logo.png';

type ForgotPasswordFormData = {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
};

// API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

// API request types
type ForgotPasswordRequest = {
  email: string;
};

type VerifyOtpRequest = {
  email: string;
  otp: string;
};

type ResetPasswordRequest = {
  email: string;
  newPassword: string;
};

// API response type
type ApiResponse = {
  message: string;
  success: boolean;
  data?: any;
};

const ForgotPassword = () => {
  const router = useRouter();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentStep, setCurrentStep] = useState<'email' | 'otp' | 'reset'>('email');
  
  // OTP State
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [isOtpLocked, setIsOtpLocked] = useState(false);
  
  // Timer State
  const [timer, setTimer] = useState(60); // 60 seconds
  const [isTimerActive, setIsTimerActive] = useState(true);
  
  const [userEmail, setUserEmail] = useState('');
  
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<ForgotPasswordFormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Create axios instance with base URL
  const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Mutation for sending forgot password OTP
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      const response = await api.post<ApiResponse>('/forgot-password-user', data);
      return response.data;
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    },
  });

  // Mutation for verifying OTP
  const verifyOtpMutation = useMutation({
    mutationFn: async (data: VerifyOtpRequest) => {
      const response = await api.post<ApiResponse>('/verify-forgot-password-otp', data);
      return response.data;
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Failed to verify OTP');
    },
  });

  // Mutation for resetting password
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const response = await api.post<ApiResponse>('/reset-password-user', data);
      return response.data;
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    },
  });

  // Auto-scroll to middle of page on mount
  useEffect(() => {
    const scrollToMiddle = () => {
      const middle = document.documentElement.scrollHeight / 3;
      window.scrollTo({
        top: middle,
        behavior: 'smooth',
      });
    };

    const timer = setTimeout(scrollToMiddle, 100);
    return () => clearTimeout(timer);
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timer]);

  // OTP Handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all digits filled
    if (newOtp.every(digit => digit !== '')) {
      handleOtpSubmit(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (enteredOtp: string) => {
    if (isOtpLocked || !userEmail) return;
    
    setOtpError('');
    
    try {
      await verifyOtpMutation.mutateAsync({
        email: userEmail,
        otp: enteredOtp
      });

      // OTP verified successfully
      setOtpVerified(true);
      setOtpAttempts(0);
      
      // Move to reset password step
      setTimeout(() => {
        setCurrentStep('reset');
      }, 500);
      
    } catch (error: any) {
      const newAttempts = otpAttempts + 1;
      setOtpAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsOtpLocked(true);
        setOtpError('Too many failed attempts. Please try again in 30 minutes.');
      } else {
        setOtpError(`${error.message}. ${3 - newAttempts} attempts remaining.`);
      }
    }
  };

  const handleResendOtp = async () => {
    if (isOtpLocked || isResending || isTimerActive || !userEmail) return;

    setIsResending(true);
    setOtpError('');
    setOtp(Array(6).fill(''));

    try {
      await forgotPasswordMutation.mutateAsync({
        email: userEmail,
      });

      // Reset timer
      setTimer(60);
      setIsTimerActive(true);
      
      // Focus first OTP input
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
      
    } catch (error: any) {
      setOtpError(error.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  // Step 1: Submit Email
  const handleEmailSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    setFormError('');
    
    try {
      await forgotPasswordMutation.mutateAsync({
        email: data.email,
      });

      // Save email and move to OTP step
      setUserEmail(data.email);
      setCurrentStep('otp');
      setIsTimerActive(true);
      setTimer(60);
      
      // Focus first OTP input
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
      
    } catch (error: any) {
      setFormError(error.message || 'Failed to send OTP. Please try again.');
    }
  };

  // Step 3: Reset Password
  const handleResetPassword: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    setFormError('');
    setSuccessMessage('');
    
    try {
      await resetPasswordMutation.mutateAsync({
        email: userEmail,
        newPassword: data.newPassword,
      });

      // Success
      setSuccessMessage('Password reset successfully! Redirecting to login...');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (error: any) {
      setFormError(error.message || 'Failed to reset password. Please try again.');
    }
  };

  const handleBackToEmail = () => {
    setCurrentStep('email');
    setOtp(Array(6).fill(''));
    setOtpError('');
    setOtpVerified(false);
    reset();
  };

  const handleBackToOtp = () => {
    setCurrentStep('otp');
    setFormError('');
    setSuccessMessage('');
  };

  const newPassword = watch('newPassword');
  

  // Email regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Loading states
  const isSubmitting = forgotPasswordMutation.isPending || verifyOtpMutation.isPending || resetPasswordMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Auto-scroll anchor */}
      <div id="forgot-password-focus" className="absolute top-1/2 transform -translate-y-1/2" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <div className="relative w-20 h-20">
            <Image
              src={logo}
              alt="DATLEP Logo"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
        </div>
        
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">
          Reset Your Password
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Follow these steps to secure your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-200">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className={`text-sm font-medium ${
                currentStep === 'email' ? 'text-blue-700' : 
                currentStep === 'otp' ? 'text-green-600' : 'text-green-600'
              }`}>
                Step 1: Enter Email
              </div>
              <div className={`text-sm font-medium ${
                currentStep === 'otp' ? 'text-blue-700' : 
                currentStep === 'reset' ? 'text-green-600' : 'text-gray-500'
              }`}>
                Step 2: Verify OTP
              </div>
              <div className={`text-sm font-medium ${
                currentStep === 'reset' ? 'text-blue-700' : 'text-gray-500'
              }`}>
                Step 3: New Password
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  currentStep === 'email' ? 'bg-blue-600 w-1/3' : 
                  currentStep === 'otp' ? 'bg-green-600 w-2/3' : 
                  'bg-green-600 w-full'
                } transition-all duration-300`}
              />
            </div>
          </div>

          {/* Step 1: Enter Email */}
          {currentStep === 'email' && (
            <form onSubmit={handleSubmit(handleEmailSubmit)} className="space-y-6">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <KeyRound className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Reset Your Password</h3>
                <p className="text-sm text-gray-600">
                  Enter your email address and we'll send you an OTP to reset your password.
                </p>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
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
                      pattern: {
                        value: emailRegex,
                        message: 'Please enter a valid email address',
                      },
                    })}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } ${watch('email') && !errors.email ? 'border-green-300' : ''}`}
                    placeholder="you@example.com"
                  />
                  {watch('email') && !errors.email && (
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

              {/* Form Error */}
              {formError && (
                <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <p className="mt-1 text-sm text-red-700">{formError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  !isValid || isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {currentStep === 'otp' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <Smartphone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Verify Your Email</h3>
                <p className="text-sm text-gray-600">
                  We've sent a 6-digit OTP to:
                  <br />
                  <span className="font-medium text-gray-900">{userEmail}</span>
                </p>
              </div>

              {/* OTP Lock Warning */}
              {isOtpLocked && (
                <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-red-400 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">OTP Locked</h3>
                      <p className="text-sm text-red-700 mt-1">
                        Too many failed attempts. Please try again in 30 minutes.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Enter 6-digit OTP
                </label>
                <div className="flex justify-between gap-2 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpInputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      disabled={isOtpLocked || otpVerified || verifyOtpMutation.isPending}
                      className={`w-full h-14 text-center text-2xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        otpVerified
                          ? 'border-green-300 bg-green-50'
                          : isOtpLocked
                          ? 'border-gray-300 bg-gray-100'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                  ))}
                </div>

                {/* Timer and Resend */}
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
                    onClick={handleResendOtp}
                    disabled={isTimerActive || isOtpLocked || isResending || otpVerified || forgotPasswordMutation.isPending}
                    className={`text-sm font-medium flex items-center ${
                      isTimerActive || isOtpLocked || isResending || otpVerified || forgotPasswordMutation.isPending
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-700 hover:text-blue-800'
                    }`}
                  >
                    {isResending || forgotPasswordMutation.isPending ? (
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

                {/* OTP Error */}
                {otpError && (
                  <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                      <p className="text-sm text-red-700">{otpError}</p>
                    </div>
                  </div>
                )}

                {/* OTP Success */}
                {otpVerified && (
                  <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-400 mr-2" />
                      <p className="text-sm text-green-700">
                        OTP verified successfully! Proceeding to reset password...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  disabled={isSubmitting || otpVerified}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                {!otpVerified && (
                  <button
                    type="button"
                    onClick={() => otp.every(d => d) && handleOtpSubmit(otp.join(''))}
                    disabled={!otp.every(d => d) || isOtpLocked || verifyOtpMutation.isPending}
                    className="flex-1 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifyOtpMutation.isPending ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </div>
                    ) : (
                      'Verify OTP'
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {currentStep === 'reset' && (
            <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-6">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Password</h3>
                <p className="text-sm text-gray-600">
                  Enter a new password for your account.
                </p>
              </div>

              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    {...register('newPassword', {
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.newPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.newPassword.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 6 characters long
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
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
                      validate: (value) => value === newPassword || 'Passwords do not match',
                    })}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
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

              {/* Form Error */}
              {formError && (
                <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <p className="mt-1 text-sm text-red-700">{formError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-green-800">Success!</h3>
                      <p className="mt-1 text-sm text-green-700">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBackToOtp}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting || !!successMessage}
                  className={`flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                    !isValid || isSubmitting || successMessage
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-700 hover:bg-blue-800'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Resetting...
                    </div>
                  ) : successMessage ? (
                    'Password Reset!'
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link
                href="/login"
                className="font-medium text-blue-700 hover:text-blue-800 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Security Features */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <h4 className="text-sm font-medium text-gray-900 mb-1">Secure</h4>
              <p className="text-xs text-gray-600">Bank-level encryption</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <Timer className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <h4 className="text-sm font-medium text-gray-900 mb-1">OTP Protected</h4>
              <p className="text-xs text-gray-600">Email verification</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <Check className="h-6 w-6 text-amber-600 mx-auto mb-2" />
              <h4 className="text-sm font-medium text-gray-900 mb-1">Trusted</h4>
              <p className="text-xs text-gray-600">Your data is safe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;