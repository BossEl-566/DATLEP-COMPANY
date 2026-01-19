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
  ArrowLeft,
  Store,
  Building,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  Truck,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  Banknote,
  Wallet
} from 'lucide-react';
import { africanCountries } from '../../../utils/countries';
import { sellerTypes, productCategories, daysOfWeek, SellerType } from '../../../utils/sellerData';
import logo from '@/assets/images/datlep-logo.png';
import ConnectBank from '../../../shared/modules/connectBank'; // Import your ConnectBank component

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

// Types
type SellerFormData = {
  // Step 1: Account
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  country: string;
  region?: string;
  city?: string;
  sellerType: SellerType;
  termsAccepted: boolean;
  
  // Step 2: Business Details
  businessRegistration?: string;
  yearsInBusiness: string;
  portfolioLink?: string;
  
  // Step 3: Shop
  shopName: string;
  shopBio: string;
  shopCategory: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  openingHours: Array<{
    day: string;
    isOpen: boolean;
    openingTime: string;
    closingTime: string;
  }>;
  shopType: 'physical' | 'online' | 'both';
  website?: string;
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
  returnPolicy?: string;
  shippingPolicy?: string;
  
  // Step 4: Bank Details (will be handled by ConnectBank component)
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    bankCode?: string;
    currency: string;
  };
};

// API request types
type RegistrationRequest = {
  name: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  region?: string;
  city?: string;
  sellerType: SellerType;
  businessRegistration?: string;
  yearsInBusiness?: string;
  portfolioLink?: string;
};

type OTPVerificationRequest = RegistrationRequest & {
  otp: string;
};

type ShopSetupRequest = {
  name: string;
  bio: string;
  category: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  openingHours: Array<{
    day: string;
    isOpen: boolean;
    openingTime: string;
    closingTime: string;
  }>;
  shopType: 'physical' | 'online' | 'both';
  website?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
  businessRegistration?: string;
  yearsInBusiness?: string;
  portfolioLink?: string;
  returnPolicy?: string;
  shippingPolicy?: string;
  customOrderPolicy?: string;
  privacyPolicy?: string;
  sellerId: string;
};

const SellerSignup = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(3);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [signupStep, setSignupStep] = useState<'form' | 'otp' | 'shop' | 'bank'>('form');
  const [userData, setUserData] = useState<RegistrationRequest | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('NG');
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [shopId, setShopId] = useState<string | null>(null);
  
  // OTP State
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [isOtpLocked, setIsOtpLocked] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
  } = useForm<SellerFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      country: 'NG',
      region: '',
      city: '',
      sellerType: 'fashion-retailer',
      termsAccepted: false,
      businessRegistration: '',
      yearsInBusiness: '<1',
      portfolioLink: '',
      shopName: '',
      shopBio: '',
      shopCategory: 'ready-to-wear',
      address: {
        street: '',
        city: '',
        state: '',
        country: 'NG',
        postalCode: ''
      },
      openingHours: daysOfWeek.map(day => ({
        day: day.id,
        isOpen: day.id !== 'sunday',
        openingTime: '09:00',
        closingTime: '18:00'
      })),
      shopType: 'both',
      website: '',
      socialLinks: [],
      returnPolicy: '',
      shippingPolicy: ''
    },
  });

  // Create axios instance
  const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Mutation for seller registration (sends OTP)
  const registrationMutation = useMutation({
    mutationFn: async (data: RegistrationRequest) => {
      const response = await api.post('/seller-registration', data);
      return response.data;
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Failed to process registration');
    },
  });

  // Mutation for OTP verification (creates account)
  const otpVerificationMutation = useMutation({
    mutationFn: async (data: OTPVerificationRequest) => {
      const response = await api.post('/verify-seller-otp', data);
      return response.data;
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Failed to verify OTP');
    },
  });

  // Mutation for shop setup
  const shopSetupMutation = useMutation({
    mutationFn: async (data: ShopSetupRequest) => {
      const response = await api.post('/create-shop', data);
      return response.data;
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Failed to setup shop');
    },
  });

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
  }, [currentStep]);

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
  const confirmPassword = watch('confirmPassword');
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  // OTP Handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

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
      const verificationData = {
        ...userData,
        otp: enteredOtp
      };

      const response = await otpVerificationMutation.mutateAsync(verificationData);
      
      if (response.seller?.id) {
        setSellerId(response.seller.id);
        console.log('Seller ID stored:', response.seller.id);
      }
      
      if (response.token) {
        localStorage.setItem('seller_token', response.token);
        console.log('Token saved to localStorage:', response.token);
      }

      setOtpVerified(true);
      setOtpAttempts(0);
      
      // Move to shop setup step
      setTimeout(() => {
        setSignupStep('shop');
        setCurrentStep(2);
      }, 1000);
      
    } catch (error: any) {
      setOtpError(error.message);
      const newAttempts = otpAttempts + 1;
      setOtpAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsOtpLocked(true);
      }
    }
  };

  const handleResendOtp = async () => {
    if (isOtpLocked || isResending || isTimerActive || !userData) return;

    setIsResending(true);
    setOtpError('');
    setOtp(Array(6).fill(''));

    try {
      await registrationMutation.mutateAsync(userData);
      setTimer(60);
      setIsTimerActive(true);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (error: any) {
      setOtpError(error.message);
    } finally {
      setIsResending(false);
    }
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setValue('country', countryCode);
    setValue('address.country', countryCode);
    trigger(['country', 'address.country']);
  };

  const handleOpeningHoursChange = (dayId: string, field: string, value: any) => {
    const currentHours = watch('openingHours');
    const updatedHours = currentHours.map(hour => 
      hour.day === dayId ? { ...hour, [field]: value } : hour
    );
    setValue('openingHours', updatedHours);
  };

  const onAccountSubmit: SubmitHandler<SellerFormData> = async (data) => {
    setFormError('');
    
    try {
      const registrationData: RegistrationRequest = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        country: data.country,
        region: data.region,
        city: data.city,
        sellerType: data.sellerType,
        businessRegistration: data.businessRegistration,
        yearsInBusiness: data.yearsInBusiness,
        portfolioLink: data.portfolioLink
      };

      const response = await registrationMutation.mutateAsync(registrationData);
      
      setUserData(registrationData);
      setSignupStep('otp');
      setIsTimerActive(true);
      setTimer(60);
      
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
      
    } catch (error: any) {
      setFormError(error.message);
    }
  };

  const onShopSubmit: SubmitHandler<SellerFormData> = async (data) => {
    try {
      if (!sellerId) {
        throw new Error('Seller ID is required');
      }

      const shopData: ShopSetupRequest = {
        name: data.shopName,
        bio: data.shopBio,
        category: data.shopCategory,
        address: data.address,
        openingHours: data.openingHours,
        shopType: data.shopType,
        website: data.website,
        socialLinks: data.socialLinks,
        businessRegistration: data.businessRegistration,
        yearsInBusiness: data.yearsInBusiness,
        portfolioLink: data.portfolioLink,
        returnPolicy: data.returnPolicy,
        shippingPolicy: data.shippingPolicy,
        customOrderPolicy: 'Contact for bulk orders',
        privacyPolicy: 'We respect your privacy and handle your information securely.',
        sellerId: sellerId
      };

      const response = await shopSetupMutation.mutateAsync(shopData);
      
      // Store shop ID for bank connection
      if (response.shop?.id) {
        setShopId(response.shop.id);
      }
      
      // Move to bank connection step
      setSignupStep('bank');
      setCurrentStep(3);
      
    } catch (error: any) {
      setFormError(error.message);
    }
  };

  const handleBankConnected = () => {
    // Redirect to seller dashboard after bank connection
    router.push('/seller/dashboard');
  };

  const isSubmitting = registrationMutation.isPending || otpVerificationMutation.isPending || shopSetupMutation.isPending;

  const renderStep1 = () => (
    <form onSubmit={handleSubmit(onAccountSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <ShoppingCart className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Step 1: Create Your Seller Account</h4>
              <p className="text-sm text-blue-700 mt-1">
                Set up your basic account information. You'll verify your email before proceeding.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What type of fashion products do you sell? *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sellerTypes.map((type) => {
              const Icon = type.icon;
              return (
                <label
                  key={type.id}
                  className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                    watch('sellerType') === type.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('sellerType', { required: true })}
                    value={type.id}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{type.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                    </div>
                  </div>
                  {watch('sellerType') === type.id && (
                    <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-blue-600" />
                  )}
                </label>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Business/Contact Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                {...register('name', {
                  required: 'Business/contact name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="John's Fashion Store"
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Business Email *
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
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } ${watch('email') && !errors.email ? 'border-green-300' : ''}`}
                placeholder="contact@yourstore.com"
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
        </div>

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Business Phone *
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
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={africanCountries.find(c => c.code === selectedCountry)?.phoneCode + " XXX XXX XXX"}
              />
            </div>
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

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
                onChange={(e) => handleCountryChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
              >
                {africanCountries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.phoneCode})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronRight className="h-5 w-5 text-gray-400 rotate-90" />
              </div>
            </div>
          </div>

          <div>
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
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="businessRegistration" className="block text-sm font-medium text-gray-700 mb-1">
              Business Registration (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="businessRegistration"
                type="text"
                {...register('businessRegistration')}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="RC-123456789"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">For registered businesses only</p>
          </div>

          <div>
            <label htmlFor="yearsInBusiness" className="block text-sm font-medium text-gray-700 mb-1">
              Years in Business *
            </label>
            <select
              id="yearsInBusiness"
              {...register('yearsInBusiness', { required: 'This field is required' })}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="<1">Less than 1 year</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="portfolioLink" className="block text-sm font-medium text-gray-700 mb-1">
            Online Portfolio/Store Link (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="portfolioLink"
              type="url"
              {...register('portfolioLink')}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://yourstore.com or Instagram handle"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Help customers see your products</p>
        </div>

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
            <Link href="/seller/terms" className="text-blue-700 hover:text-blue-800">
              Seller Terms
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
          'Continue to Email Verification'
        )}
      </button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleSubmit(onShopSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <Store className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-green-800">Step 2: Setup Your Fashion Shop</h4>
              <p className="text-sm text-green-700 mt-1">
                Create your online storefront where customers can browse and purchase your fashion products.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">
              Shop Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Store className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="shopName"
                type="text"
                {...register('shopName', {
                  required: 'Shop name is required',
                  minLength: { value: 2, message: 'Shop name must be at least 2 characters' },
                })}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.shopName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Elegant Stitches Fashion"
              />
            </div>
            {errors.shopName && (
              <p className="mt-2 text-sm text-red-600">{errors.shopName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="shopCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Main Product Category *
            </label>
            <select
              id="shopCategory"
              {...register('shopCategory', { required: 'Category is required' })}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <optgroup label="Clothing">
                {productCategories.filter(cat => [
                  'ready-to-wear', 'traditional-wear', 'wedding-attire', 
                  'children-fashion', 'mens-fashion', 'womens-fashion',
                  'casual-wear', 'formal-wear', 'sportswear',
                  'lingerie', 'maternity-wear'
                ].includes(cat.id)).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Footwear">
                {productCategories.filter(cat => [
                  'footwear', 'sandals', 'boots', 'sneakers'
                ].includes(cat.id)).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Accessories">
                {productCategories.filter(cat => [
                  'jewelry', 'bags-purses', 'belts', 'hats',
                  'scarves', 'gloves', 'ties', 'socks'
                ].includes(cat.id)).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Fabrics & Materials">
                {productCategories.filter(cat => [
                  'fabrics', 'cotton', 'ankara', 'lace',
                  'silk', 'leather', 'denim', 'knits'
                ].includes(cat.id)).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Materials & Supplies">
                {productCategories.filter(cat => [
                  'buttons', 'zippers', 'threads', 'beads',
                  'embroidery', 'ribbons', 'patches', 'labels'
                ].includes(cat.id)).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="shopBio" className="block text-sm font-medium text-gray-700 mb-1">
            Shop Description *
          </label>
          <div className="relative">
            <textarea
              id="shopBio"
              {...register('shopBio', {
                required: 'Shop description is required',
                minLength: { value: 20, message: 'Please provide at least 20 characters' },
                maxLength: { value: 500, message: 'Description cannot exceed 500 characters' },
              })}
              rows={3}
              className={`block w-full px-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.shopBio ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe your shop, the types of fashion products you sell, your style, and what makes your products unique..."
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {watch('shopBio')?.length || 0}/500
            </div>
          </div>
          {errors.shopBio && (
            <p className="mt-2 text-sm text-red-600">{errors.shopBio.message}</p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Shop Address *</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="address.street" className="block text-xs font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                id="address.street"
                type="text"
                {...register('address.street')}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Street address"
              />
            </div>
            <div>
              <label htmlFor="address.city" className="block text-xs font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                id="address.city"
                type="text"
                {...register('address.city', { required: 'City is required' })}
                className={`block w-full px-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.address?.city ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="City"
              />
            </div>
            <div>
              <label htmlFor="address.state" className="block text-xs font-medium text-gray-700 mb-1">
                State/Province
              </label>
              <input
                id="address.state"
                type="text"
                {...register('address.state')}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="State or province"
              />
            </div>
            <div>
              <label htmlFor="address.postalCode" className="block text-xs font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                id="address.postalCode"
                type="text"
                {...register('address.postalCode')}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Postal code"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Business Hours (If you have a physical store)</h3>
          <div className="space-y-3">
            {daysOfWeek.map((day) => {
              const dayHours = watch('openingHours').find(h => h.day === day.id);
              return (
                <div key={day.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={dayHours?.isOpen || false}
                      onChange={(e) => handleOpeningHoursChange(day.id, 'isOpen', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-900">{day.label}</span>
                  </div>
                  {dayHours?.isOpen ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={dayHours.openingTime || '09:00'}
                        onChange={(e) => handleOpeningHoursChange(day.id, 'openingTime', e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={dayHours.closingTime || '18:00'}
                        onChange={(e) => handleOpeningHoursChange(day.id, 'closingTime', e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 italic">Closed</span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-gray-500">For online-only shops, you can mark all days as closed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="shopType" className="block text-sm font-medium text-gray-700 mb-1">
              Shop Type *
            </label>
            <select
              id="shopType"
              {...register('shopType', { required: 'Shop type is required' })}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="physical">Physical Store Only</option>
              <option value="online">Online Store Only</option>
              <option value="both">Both Physical & Online Store</option>
            </select>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Website (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="website"
                type="url"
                {...register('website')}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="https://yourstore.com"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="returnPolicy" className="block text-sm font-medium text-gray-700 mb-1">
            Return & Exchange Policy (Optional)
          </label>
          <textarea
            id="returnPolicy"
            {...register('returnPolicy')}
            rows={2}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Describe your return and exchange policy for fashion items..."
          />
          <p className="mt-1 text-xs text-gray-500">Example: "Returns accepted within 14 days for unworn items with tags"</p>
        </div>

        <div>
          <label htmlFor="shippingPolicy" className="block text-sm font-medium text-gray-700 mb-1">
            Shipping Policy (Optional)
          </label>
          <textarea
            id="shippingPolicy"
            {...register('shippingPolicy')}
            rows={2}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Describe your shipping methods, costs, and delivery times..."
          />
          <p className="mt-1 text-xs text-gray-500">Example: "Free shipping for orders over $50, delivery within 3-5 business days"</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Creating Your Shop...
          </div>
        ) : (
          <>
            Continue to Bank Connection
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );

  const renderOTPVerification = () => (
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
        <p className="text-xs text-gray-500 mt-2">
          For testing, use OTP: <span className="font-mono font-bold">123456</span>
        </p>
      </div>

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
                Email verified successfully! Setting up your seller account...
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setSignupStep('form')}
        disabled={isSubmitting || otpVerified}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Account Details
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div id="signup-focus" className="absolute top-1/2 transform -translate-y-1/2" />
      
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
          Sell Fashion Products on DATLEP
        </h2>
        <p className="text-center text-gray-600 mb-8">
          List your fashion items and reach customers across Africa
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-200">
          {/* Progress Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep === step
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : currentStep > step
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-gray-300 text-gray-500'
                    }`}
                  >
                    {currentStep > step ? <Check className="h-5 w-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-32 h-1 mx-4 ${
                        currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between text-sm font-medium">
              <span className={currentStep === 1 ? 'text-blue-700' : currentStep > 1 ? 'text-green-600' : 'text-gray-500'}>
                Create Account
              </span>
              <span className={currentStep === 2 ? 'text-blue-700' : currentStep > 2 ? 'text-green-600' : currentStep < 2 ? 'text-gray-500' : 'text-gray-500'}>
                Setup Shop
              </span>
              <span className={currentStep === 3 ? 'text-blue-700' : 'text-gray-500'}>
                Connect Bank
              </span>
            </div>
          </div>

          {/* Current Step Content */}
          {signupStep === 'otp' ? (
            renderOTPVerification()
          ) : currentStep === 1 ? (
            renderStep1()
          ) : currentStep === 2 ? (
            renderStep2()
          ) : currentStep === 3 && (
            <ConnectBank 
            sellerId={sellerId} shopId={shopId} onBankConnected={handleBankConnected} 
            />
          )}

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have a seller account?{' '}
              <Link
                href="/seller/login"
                className="font-medium text-blue-700 hover:text-blue-800 transition-colors"
              >
                Sign in here
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Offer custom services or craftsmanship?{' '}
              <Link
                href="/bespoke/signup"
                className="font-medium text-purple-700 hover:text-purple-800 transition-colors"
              >
                Become a Bespoke Creator
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <ShoppingCart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Easy Listing</h4>
            <p className="text-xs text-gray-600">List products in minutes with photos & details</p>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <Truck className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Nationwide Reach</h4>
            <p className="text-xs text-gray-600">Sell to customers across African countries</p>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <Banknote className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Secure Payments</h4>
            <p className="text-xs text-gray-600">Multiple payment options with fraud protection</p>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <TrendingUp className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Grow Your Business</h4>
            <p className="text-xs text-gray-600">Tools to manage inventory and track sales</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerSignup;