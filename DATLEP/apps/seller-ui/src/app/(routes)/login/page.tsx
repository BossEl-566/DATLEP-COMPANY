"use client";

import React, { useState, useEffect } from 'react';
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
  AlertCircle, 
  LogIn,
  Store,
  ShoppingBag,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import logo from '@/assets/images/datlep-logo.png';

type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

// API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

// API request type
type LoginRequest = {
  email: string;
  password: string;
};

// API response type
type LoginResponse = {
  message: string;
  success: boolean;
  seller?: {
    id: string;
    name: string;
    email: string;
    sellerType: string;
    shopId?: string;
    isVerified: boolean;
  };
  token?: string;
};

const SellerLogin = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    reset,
  } = useForm<LoginFormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Create axios instance with base URL
  const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Mutation for seller login
  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await api.post<LoginResponse>('/seller-login', data);
      return response.data;
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
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

  // Check for existing seller token on mount
  useEffect(() => {
    const token = localStorage.getItem('seller_token');
    const sellerData = localStorage.getItem('seller_data');
    
    if (token && sellerData) {
      // Auto-fill email if remembered
      try {
        const parsedSeller = JSON.parse(sellerData);
        reset({ email: parsedSeller.email });
      } catch (error) {
        console.log('Could not parse stored seller data');
      }
    }
  }, [reset]);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setLoginError('');
    setLoginSuccess(false);
    
    try {
      const result = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password
      });

      console.log('Seller login successful:', result);
      
      // Store seller data and token
      if (result.token) {
        localStorage.setItem('seller_token', result.token);
      }
      
      if (result.seller) {
        const sellerData = {
          id: result.seller.id,
          name: result.seller.name,
          email: result.seller.email,
          sellerType: result.seller.sellerType,
          shopId: result.seller.shopId,
          isVerified: result.seller.isVerified
        };
        
        if (data.rememberMe) {
          localStorage.setItem('seller_data', JSON.stringify(sellerData));
        } else {
          sessionStorage.setItem('seller_data', JSON.stringify(sellerData));
        }
        
        // Show success message
        setLoginSuccess(true);
        
        // Redirect after delay
        setTimeout(() => {
          if (result.seller?.shopId) {
            router.push('/seller/dashboard');
          } else {
            router.push('/seller/setup-shop');
          }
        }, 1500);
      }
      
    } catch (error: any) {
      setLoginError(error.message || 'Invalid email or password. Please try again.');
    }
  };

  // Email regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Loading state from mutation
  const isSubmitting = loginMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Auto-scroll anchor */}
      <div id="login-focus" className="absolute top-1/2 transform -translate-y-1/2" />
      
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
          Seller Login
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Access your seller dashboard to manage your shop
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-200">
          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Business Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: emailRegex,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  onBlur={() => trigger('email')}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="business@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="/seller/forgot-password"
                  className="text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
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
                  placeholder="••••••••"
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
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                {...register('rememberMe')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me on this device
              </label>
            </div>

            {/* Login Success */}
            {loginSuccess && (
              <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-green-400 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">Login Successful!</h3>
                    <p className="mt-1 text-sm text-green-700">
                      Redirecting to your seller dashboard...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Login Error */}
            {loginError && !loginSuccess && (
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || isSubmitting || loginSuccess}
              className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                !isValid || isSubmitting || loginSuccess
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-700 hover:bg-blue-800'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : loginSuccess ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Redirecting...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Sign in to Seller Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">New to DATLEP Seller?</span>
            </div>
          </div>

          {/* Sign Up Button */}
          <Link
            href="/signup"
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Store className="h-5 w-5" />
            Create Seller Account
          </Link>

          {/* Alternative Links */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Looking for Bespoke services?{' '}
              <Link
                href="/bespoke/login"
                className="font-medium text-purple-700 hover:text-purple-800 transition-colors"
              >
                Bespoke Creator Login
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Want to shop for fashion?{' '}
              <Link
                href="/login"
                className="font-medium text-blue-700 hover:text-blue-800 transition-colors"
              >
                Customer Login
              </Link>
            </p>
          </div>
        </div>

        {/* Seller Benefits */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <ShoppingBag className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Easy Product Management</h4>
            <p className="text-xs text-gray-600">List, edit, and track your products</p>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Sales Analytics</h4>
            <p className="text-xs text-gray-600">Track your sales and customer insights</p>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <Shield className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Secure Payments</h4>
            <p className="text-xs text-gray-600">Multiple payment options with protection</p>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-8 text-center">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 inline-block">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-blue-600 mr-2" />
              <p className="text-sm text-blue-800">
                Your business credentials are encrypted and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;