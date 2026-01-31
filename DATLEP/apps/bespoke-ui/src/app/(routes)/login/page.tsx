'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  X,
  ArrowRight,
  Sparkles,
  Scissors,
  Shirt,
  Diamond,
  Palette,
  Award,
  Users,
  Shield,
  CreditCard,
  TrendingUp,
  Clock,
  Smartphone,
  User,
  ArrowLeft
} from 'lucide-react';
import logo from '../../assets/images/datlep-logo.png';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

// Types
type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type LoginResponse = {
  token: string;
  refreshToken: string;
  creator: {
    id: string;
    email: string;
    businessName: string;
    specialization: string;
    isVerified: boolean;
    profileCompletion: number;
  };
};

type ForgotPasswordData = {
  email: string;
};

const BespokeLogin = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isValid: loginIsValid },
    watch: loginWatch,
    reset: resetLoginForm,
  } = useForm<LoginFormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const {
    register: forgotPasswordRegister,
    handleSubmit: handleForgotPasswordSubmit,
    formState: { errors: forgotPasswordErrors, isValid: forgotPasswordIsValid },
    watch: forgotPasswordWatch,
    reset: resetForgotPasswordForm,
  } = useForm<ForgotPasswordData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  // Create axios instance
  const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});


  // Mutation for login
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await api.post('/login-bespoke', {
        email: data.email,
        password: data.password,
      });
      return response.data as LoginResponse;
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    },
  });

  // Mutation for forgot password
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const response = await api.post('/forgot-password-bespoke', {
        email: data.email,
      });
      return response.data;
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Failed to send reset instructions.');
    },
  });

  // Mutation for refresh token (optional, for future use)
  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem('bespoke_refresh_token');
      if (!refreshToken) throw new Error('No refresh token found');
      
      const response = await api.post('/bespoke-refresh-token', {
        refreshToken,
      });
      return response.data;
    },
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const email = loginWatch('email');
  const forgotEmail = forgotPasswordWatch('email');

  const onLoginSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setLoginError('');
    
    try {
      const response = await loginMutation.mutateAsync(data);
      
      // Store tokens
      localStorage.setItem('bespoke_token', response.token);
      localStorage.setItem('bespoke_refresh_token', response.refreshToken);
      
      // Store user data
      localStorage.setItem('bespoke_creator', JSON.stringify(response.creator));
      
      // Store remember me preference
      if (data.rememberMe) {
        localStorage.setItem('bespoke_remember_email', data.email);
      } else {
        localStorage.removeItem('bespoke_remember_email');
      }
      
      // Redirect based on profile completion
      if (response.creator.profileCompletion < 80) {
        router.push('/bespoke/complete-profile');
      } else {
        router.push('/bespoke/dashboard');
      }
      
    } catch (error: any) {
      setLoginError(error.message);
    }
  };

  const onForgotPasswordSubmit: SubmitHandler<ForgotPasswordData> = async (data) => {
    setLoginError('');
    
    try {
      await forgotPasswordMutation.mutateAsync(data);
      setForgotPasswordSuccess(true);
      setForgotPasswordEmail(data.email);
      resetForgotPasswordForm();
    } catch (error: any) {
      setLoginError(error.message);
    }
  };

  const handleDemoLogin = () => {
    resetLoginForm({
      email: 'demo@bespokecreator.com',
      password: 'demo123',
      rememberMe: false,
    });
  };

  // Load remembered email on component mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('bespoke_remember_email');
    if (rememberedEmail) {
      resetLoginForm({
        email: rememberedEmail,
        password: '',
        rememberMe: true,
      });
    }
  }, [resetLoginForm]);

  const isSubmitting = loginMutation.isPending || forgotPasswordMutation.isPending;

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
          Welcome Back, Creator
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Sign in to manage your bespoke creations and clients
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-200">
          {/* Login Form */}
          {!forgotPasswordMode ? (
            <>
              <div className="mb-8">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <Sparkles className="h-5 w-5 text-purple-600 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-purple-800">Bespoke Creator Access</h4>
                      <p className="text-sm text-purple-700 mt-1">
                        Sign in to manage your custom orders, portfolio, and client projects.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-6">
                <div className="space-y-4">
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
                        {...loginRegister('email', {
                          required: 'Email is required',
                          pattern: { value: emailRegex, message: 'Please enter a valid email address' },
                        })}
                        className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                          loginErrors.email ? 'border-red-300' : 'border-gray-300'
                        } ${email && !loginErrors.email ? 'border-green-300' : ''}`}
                        placeholder="your@email.com"
                        autoComplete="email"
                      />
                      {email && !loginErrors.email && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                      {loginErrors.email && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <X className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {loginErrors.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {loginErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password *
                      </label>
                      <button
                        type="button"
                        onClick={() => setForgotPasswordMode(true)}
                        className="text-sm text-purple-700 hover:text-purple-800 font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...loginRegister('password', {
                          required: 'Password is required',
                          minLength: { value: 6, message: 'Password must be at least 6 characters' },
                        })}
                        className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                          loginErrors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your password"
                        autoComplete="current-password"
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
                    {loginErrors.password && (
                      <p className="mt-2 text-sm text-red-600">{loginErrors.password.message}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      {...loginRegister('rememberMe')}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                      Remember me on this device
                    </label>
                  </div>
                </div>

                {loginError && (
                  <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-red-800">Login Error</h3>
                        <p className="mt-1 text-sm text-red-700">{loginError}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={!loginIsValid || isSubmitting}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors ${
                      !loginIsValid || isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-purple-700 hover:bg-purple-800'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                  >
                    Try Demo Account
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Forgot Password Form */}
              <div className="mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Reset Your Password</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Enter your email address and we'll send you instructions to reset your password.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {forgotPasswordSuccess ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Check Your Email</h3>
                    <p className="text-sm text-gray-600">
                      We've sent password reset instructions to:
                      <br />
                      <span className="font-medium text-gray-900">{forgotPasswordEmail}</span>
                    </p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                        <div className="text-sm text-blue-700">
                          <p className="font-medium">What to expect:</p>
                          <ul className="mt-1 space-y-1">
                            <li>• Check your inbox for an email from DATLEP</li>
                            <li>• Click the password reset link in the email</li>
                            <li>• Follow instructions to create a new password</li>
                            <li>• The link expires in 1 hour for security</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordMode(false);
                        setForgotPasswordSuccess(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Sign In
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => onForgotPasswordSubmit({ email: forgotPasswordEmail })}
                      className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      Resend Instructions
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit(onForgotPasswordSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="forgotEmail"
                        type="email"
                        {...forgotPasswordRegister('email', {
                          required: 'Email is required',
                          pattern: { value: emailRegex, message: 'Please enter a valid email address' },
                        })}
                        className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                          forgotPasswordErrors.email ? 'border-red-300' : 'border-gray-300'
                        } ${forgotEmail && !forgotPasswordErrors.email ? 'border-green-300' : ''}`}
                        placeholder="your@email.com"
                        autoComplete="email"
                      />
                      {forgotEmail && !forgotPasswordErrors.email && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                      {forgotPasswordErrors.email && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <X className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {forgotPasswordErrors.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {forgotPasswordErrors.email.message}
                      </p>
                    )}
                  </div>

                  {loginError && (
                    <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                        <div>
                          <h3 className="text-sm font-medium text-red-800">Error</h3>
                          <p className="mt-1 text-sm text-red-700">{loginError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={!forgotPasswordIsValid || isSubmitting}
                      className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                        !forgotPasswordIsValid || isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        'Send Reset Instructions'
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setForgotPasswordMode(false)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Alternative Options */}
          {!forgotPasswordMode && (
            <div className="mt-6 space-y-3">
              
              <div className="text-center text-sm">
                <Link
                  href="/login/help"
                  className="font-medium text-purple-700 hover:text-purple-800"
                >
                  Need help signing in?
                </Link>
              </div>
            </div>
          )}

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have a creator account?{' '}
              <Link
                href="/bespoke/signup"
                className="font-medium text-purple-700 hover:text-purple-800 transition-colors"
              >
                Become a Bespoke Creator
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Sell ready-made fashion items?{' '}
              <Link
                href="/seller/login"
                className="font-medium text-blue-700 hover:text-blue-800 transition-colors"
              >
                Seller Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits & Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <Scissors className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Manage Projects</h4>
            <p className="text-xs text-gray-600">Track custom orders and client projects</p>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Client Network</h4>
            <p className="text-xs text-gray-600">Connect with clients seeking craftsmanship</p>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <CreditCard className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Secure Payments</h4>
            <p className="text-xs text-gray-600">Safe transactions with deposit protection</p>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <TrendingUp className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Grow Business</h4>
            <p className="text-xs text-gray-600">Tools to showcase and scale your craft</p>
          </div>
        </div>

        {/* Demo Account Info */}
        <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="flex items-start">
            <Award className="h-5 w-5 text-purple-600 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-purple-800">Demo Account Available</h4>
              <p className="text-sm text-purple-700 mt-1">
                Want to explore first? Click "Try Demo Account" to sign in with pre-filled credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BespokeLogin;