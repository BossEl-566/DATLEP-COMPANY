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
  User, 
  Shield, 
  Check, 
  X, 
  AlertCircle,
  Clock,
  RefreshCw,
  Timer,
  Smartphone,
  ArrowLeft
} from 'lucide-react';
import GoogleSignIn from '../../../shared/components/google-button/index';
import logo from '@/assets/images/datlep-logo.png';

// API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

type SignupFormData = {
  name: string;
  email: string;
  password: string;
  termsAccepted: boolean;
};

// API request types
type RegistrationRequest = {
  name: string;
  email: string;
  password: string;
};

type OTPVerificationRequest = RegistrationRequest & {
  otp: string;
};

// API response types
type ApiResponse = {
  message: string;
  success: boolean;
  data?: any;
};

const Signup = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [signupStep, setSignupStep] = useState<'form' | 'otp'>('form');
  const [userData, setUserData] = useState<{name: string; email: string; password: string} | null>(null);
  
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
  
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<SignupFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      termsAccepted: false,
    },
  });

  // Create axios instance with base URL
  const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Mutation for user registration
  const registrationMutation = useMutation({
    mutationFn: async (data: RegistrationRequest) => {
      const response = await api.post<ApiResponse>('/user-registration', data);
      return response.data;
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Failed to process registration');
    },
  });

  // Mutation for OTP verification
  const otpVerificationMutation = useMutation({
    mutationFn: async (data: OTPVerificationRequest) => {
      const response = await api.post<ApiResponse>('/verify-user-otp', data);
      return response.data;
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Failed to verify OTP');
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

  const password = watch('password');

  // Email regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
    if (isOtpLocked || !userData) return;
    
    setOtpError('');
    
    try {
      await otpVerificationMutation.mutateAsync({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        otp: enteredOtp
      });

      // OTP verified successfully
      setOtpVerified(true);
      setOtpAttempts(0);
      
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
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
    if (isOtpLocked || isResending || isTimerActive || !userData) return;

    setIsResending(true);
    setOtpError('');
    setOtp(Array(6).fill(''));

    try {
      await registrationMutation.mutateAsync({
        name: userData.name,
        email: userData.email,
        password: userData.password
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

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    setFormError('');
    
    try {
      await registrationMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password
      });

      // Save user data for OTP verification step
      setUserData(data);
      
      // Move to OTP step
      setSignupStep('otp');
      setIsTimerActive(true);
      setTimer(60);
      
      // Focus first OTP input
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
      
    } catch (error: any) {
      setFormError(error.message || 'Failed to start registration. Please try again.');
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign-in clicked');
    // Implement Google OAuth here
  };

  // Loading states from mutations
  const isSubmitting = registrationMutation.isPending || otpVerificationMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Auto-scroll anchor */}
      <div id="signup-focus" className="absolute top-1/2 transform -translate-y-1/2" />
      
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
          Join DATLEP
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Create your account in 2 simple steps
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-200">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className={`text-sm font-medium ${signupStep === 'form' ? 'text-blue-700' : 'text-green-600'}`}>
                Step 1: Your Details
              </div>
              <div className={`text-sm font-medium ${signupStep === 'otp' ? 'text-blue-700' : 'text-gray-500'}`}>
                Step 2: Verify Email
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${signupStep === 'form' ? 'bg-blue-600 w-1/2' : 'bg-green-600 w-full'} transition-all duration-300`}
              />
            </div>
          </div>

          {/* OTP Verification Step */}
          {signupStep === 'otp' ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <Smartphone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Verify Your Email</h3>
                <p className="text-sm text-gray-600">
                  We've sent a 6-digit OTP to:
                  <br />
                  <span className="font-medium text-gray-900">{userData?.email}</span>
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
                      ref={(el) => { otpInputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      disabled={isOtpLocked || otpVerified || otpVerificationMutation.isPending}
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
                    disabled={isTimerActive || isOtpLocked || isResending || otpVerified || registrationMutation.isPending}
                    className={`text-sm font-medium flex items-center ${
                      isTimerActive || isOtpLocked || isResending || otpVerified || registrationMutation.isPending
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-700 hover:text-blue-800'
                    }`}
                  >
                    {isResending || registrationMutation.isPending ? (
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
                        Email verified successfully! Redirecting...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => setSignupStep('form')}
                disabled={isSubmitting || otpVerified}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Details
              </button>
            </div>
          ) : (
            /* Signup Form Step - Simplified */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
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
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                    })}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                )}
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

              {/* Password Field - Simplified */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
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
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
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
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 6 characters long
                </p>
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input
                  id="termsAccepted"
                  type="checkbox"
                  {...register('termsAccepted', {
                    required: 'You must accept the terms and conditions',
                  })}
                  className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-700">
                  I agree to DATLEP's{' '}
                  <Link href="/terms" className="text-blue-700 hover:text-blue-800">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-700 hover:text-blue-800">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.termsAccepted && (
                <p className="text-sm text-red-600">{errors.termsAccepted.message}</p>
              )}

              {/* Form Error */}
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
                  'Continue with Email Verification'
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          {signupStep === 'form' && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Sign-In */}
              <div className="mt-6">
                <GoogleSignIn 
                  onClick={handleGoogleSignIn}
                  text="Continue with Google"
                />
              </div>
            </>
          )}

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
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
              <h4 className="text-sm font-medium text-gray-900 mb-1">Fast</h4>
              <p className="text-xs text-gray-600">Quick verification</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <Check className="h-6 w-6 text-amber-600 mx-auto mb-2" />
              <h4 className="text-sm font-medium text-gray-900 mb-1">Trusted</h4>
              <p className="text-xs text-gray-600">Thousands of creators</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;