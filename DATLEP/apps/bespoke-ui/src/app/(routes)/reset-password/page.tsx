'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  X,
  Shield,
  ArrowRight,
  ArrowLeft,
  Mail,
  Timer,
  RefreshCw
} from 'lucide-react';
import logo from '@/assets/images/datlep-logo.png';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

type ResetPasswordData = {
  token: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type VerifyTokenData = {
  token: string;
  email: string;
};

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<ResetPasswordData>({
    mode: 'onChange',
    defaultValues: {
      token: token || '',
      email: email || '',
      password: '',
      confirmPassword: '',
    },
  });

  // Create axios instance
  const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Mutation for verifying token
  const verifyTokenMutation = useMutation({
    mutationFn: async (data: VerifyTokenData) => {
      const response = await api.post('/verify-bespoke-forgot-password', data);
      return response.data;
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Invalid or expired reset link.');
    },
  });

  // Mutation for resetting password
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const response = await api.post('/reset-bespoke-password', data);
      return response.data;
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Failed to reset password.');
    },
  });

  // Verify token on component mount
  React.useEffect(() => {
    const verifyToken = async () => {
      if (!token || !email) {
        setResetError('Invalid reset link. Please request a new password reset.');
        setVerifyingToken(false);
        return;
      }

      try {
        const response = await verifyTokenMutation.mutateAsync({ token, email });
        setUserEmail(email);
        setTokenVerified(true);
        setVerifyingToken(false);
      } catch (error: any) {
        setResetError(error.message);
        setVerifyingToken(false);
        setIsTimerActive(true);
      }
    };

    verifyToken();
  }, [token, email]);

  // Timer effect for resend cooldown
  React.useEffect(() => {
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
  const confirmPassword = watch('confirmPassword');

  const onResetSubmit: SubmitHandler<ResetPasswordData> = async (data) => {
    setResetError('');
    
    try {
      await resetPasswordMutation.mutateAsync(data);
      setResetSuccess(true);
      reset();
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/bespoke/login');
      }, 3000);
      
    } catch (error: any) {
      setResetError(error.message);
    }
  };

  const handleResendLink = async () => {
    if (isTimerActive || !userEmail) return;
    
    try {
      await api.post('/forgot-password-bespoke', { email: userEmail });
      setTimer(60);
      setIsTimerActive(true);
      setResetError('');
    } catch (error: any) {
      setResetError('Failed to resend reset link. Please try again.');
    }
  };

  if (verifyingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-8">
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
          
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
                <Shield className="h-6 w-6 text-purple-600 animate-pulse" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Verifying Reset Link</h3>
              <p className="text-sm text-gray-600">
                Please wait while we verify your password reset link...
              </p>
              <div className="mt-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-8">
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
          
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid Reset Link</h3>
              <p className="text-sm text-gray-600 mb-6">
                {resetError || 'This password reset link is invalid or has expired.'}
              </p>
              
              <div className="space-y-4">
                {userEmail && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Timer className="h-4 w-4 text-gray-500 mr-1" />
                      <span className={`text-sm ${isTimerActive ? 'text-amber-600' : 'text-gray-500'}`}>
                        {isTimerActive 
                          ? `Resend available in ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`
                          : 'Ready to resend'
                        }
                      </span>
                    </div>
                    
                    <button
                      onClick={handleResendLink}
                      disabled={isTimerActive}
                      className={`text-sm font-medium flex items-center ${
                        isTimerActive
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-purple-700 hover:text-purple-800'
                      }`}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Resend Link
                    </button>
                  </div>
                )}
                
                <Link
                  href="/bespoke/login"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Link>
                
                <Link
                  href="/bespoke/forgot-password"
                  className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 block"
                >
                  Request New Reset Link
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-8">
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
          
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Password Reset Successful!</h3>
              <p className="text-sm text-gray-600 mb-6">
                Your password has been successfully updated. You'll be redirected to sign in shortly.
              </p>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-500">
                  Redirecting in 3 seconds...
                </div>
                
                <Link
                  href="/bespoke/login"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <ArrowRight className="h-4 w-4" />
                  Sign In Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
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
          Create a new password for your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-200">
          <div className="mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">Create New Password</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Enter a new password for: <span className="font-medium">{userEmail}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onResetSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password *
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
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'Must include uppercase, lowercase, and number'
                      }
                    })}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter new password"
                    autoComplete="new-password"
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
                <div className="mt-2 text-xs text-gray-500">
                  <p>Password must include:</p>
                  <ul className="list-disc list-inside ml-2">
                    <li className={password?.length >= 6 ? 'text-green-600' : 'text-gray-500'}>
                      At least 6 characters
                    </li>
                    <li className={/[a-z]/.test(password || '') ? 'text-green-600' : 'text-gray-500'}>
                      One lowercase letter
                    </li>
                    <li className={/[A-Z]/.test(password || '') ? 'text-green-600' : 'text-gray-500'}>
                      One uppercase letter
                    </li>
                    <li className={/\d/.test(password || '') ? 'text-green-600' : 'text-gray-500'}>
                      One number
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password *
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
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
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
                {confirmPassword && password === confirmPassword && !errors.confirmPassword && (
                  <p className="mt-2 text-sm text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    Passwords match
                  </p>
                )}
              </div>
            </div>

            {resetError && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Reset Error</h3>
                    <p className="mt-1 text-sm text-red-700">{resetError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={!isValid || resetPasswordMutation.isPending}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
                  !isValid || resetPasswordMutation.isPending
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {resetPasswordMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>

              <Link
                href="/bespoke/login"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>

        {/* Security Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Password Security Tips</h4>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Use a unique password not used elsewhere</li>
                <li>• Consider using a password manager</li>
                <li>• Enable two-factor authentication in your account settings</li>
                <li>• Regularly update your password for security</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;