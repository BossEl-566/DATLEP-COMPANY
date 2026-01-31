'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Globe,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Sparkles,
  Scissors,
  Shirt,
  Diamond,
  Palette,
  Award,
  TrendingUp,
  Users,
  Shield,
  ArrowRight
} from 'lucide-react';
import logo from '../../assets/images/datlep-logo.png';
import { africanCountries } from '../signup/utils/countries';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

// Types
type SignupFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  country: string;
  city: string;
  creatorType: string;
  termsAccepted: boolean;
};

type RegistrationRequest = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  country: string;
  city: string;
  creatorType: string;
};

type OTPVerificationRequest = {
  name: string;
  email: string;
  otp: string;
  password: string;
  phoneNumber: string;
  country: string;
  city: string;
  creatorType: string;
};


const BespokeSignup = () => {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('NG');
  
  // OTP State
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [signupData, setSignupData] = useState<RegistrationRequest | null>(null);


  const otpInputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  // Create axios instance
  const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Mutation for initial registration (sends OTP)
  const registrationMutation = useMutation({
    mutationFn: async (data: RegistrationRequest) => {
      const response = await api.post('/send-bespoke-otp', data);
      return response.data;
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Failed to start registration');
    },
  });

  // Mutation for OTP verification
  const otpVerificationMutation = useMutation({
    mutationFn: async (data: OTPVerificationRequest) => {
      const response = await api.post('/verify-bespoke-otp', data);
      return response.data;
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Invalid OTP');
    },
  });

  // Timer Effect
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

  const creatorTypes = [
    { id: 'tailor', label: 'Tailor', icon: Scissors, description: 'Custom clothing and alterations' },
    { id: 'seamstress', label: 'Seamstress', icon: Shirt, description: 'Dressmaking and sewing' },
    { id: 'shoemaker', label: 'Shoemaker', icon: Award, description: 'Footwear and shoe repairs' },
    { id: 'leather-worker', label: 'Leather Worker', icon: Diamond, description: 'Leather goods and accessories' },
    { id: 'jewelry-maker', label: 'Jewelry Maker', icon: Sparkles, description: 'Handmade jewelry' },
    { id: 'embroidery', label: 'Embroidery Artist', icon: Palette, description: 'Embroidery and embellishments' },
    { id: 'weaving', label: 'Weaving Specialist', icon: Users, description: 'Traditional and modern weaving' },
    { id: 'other', label: 'Other Crafts', icon: Sparkles, description: 'Other creative craftsmanship' },
  ];

  const handleSignupSubmit = async (data: SignupFormData) => {
  setFormError('');

  const registrationData: RegistrationRequest = {
    name: data.name,
    email: data.email,
    password: data.password,
    phoneNumber: data.phoneNumber,
    country: data.country,
    city: data.city,
    creatorType: data.creatorType
  };

  await registrationMutation.mutateAsync(registrationData);

  // ✅ Save for OTP step
  setSignupData(registrationData);
  setUserEmail(data.email);
  setStep('otp');
};


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
  if (!signupData) return;

  setOtpError('');

  try {
    const verificationData = {
      ...signupData,
      otp: enteredOtp
    };

    const response = await otpVerificationMutation.mutateAsync(
      verificationData
    );

    // ✅ THIS is what you were missing
    if (response.success) {
      setOtpVerified(true);

      // optional: store creator
      if (response.creator) {
        localStorage.setItem(
          'bespoke_creator',
          JSON.stringify(response.creator)
        );
      }

      // ✅ redirect immediately
      router.push('/bespoke/dashboard');
    }
  } catch (error: any) {
    setOtpError(error.message);

    // Reset OTP input
    setOtp(Array(6).fill(''));
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 100);
  }
};



  const handleResendOtp = async () => {
    if (isTimerActive || isResending || !userEmail) return;

    setIsResending(true);
    setOtpError('');
    setOtp(Array(6).fill(''));

    try {
      // Re-send OTP using forgot password endpoint or similar
      await api.post('/forgot-password-bespoke', { email: userEmail });
      
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

  const isSubmitting = registrationMutation.isPending || otpVerificationMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
          Join as a Creator
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Start showcasing your craftsmanship in minutes
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-200">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step === 'form' ? 'border-purple-600 bg-purple-600 text-white' : 'border-green-600 bg-green-600 text-white'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 mx-4 ${step === 'otp' ? 'bg-green-600' : 'bg-gray-200'}`} />
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step === 'otp' ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300 text-gray-500'
              }`}>
                2
              </div>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <span className={`text-sm font-medium ${step === 'form' ? 'text-purple-700' : 'text-green-600'}`}>
              {step === 'form' ? 'Create Account' : 'Verify Email'}
            </span>
          </div>

          {step === 'form' ? (
            <SignupForm 
              onSubmit={handleSignupSubmit}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              creatorTypes={creatorTypes}
              formError={formError}
              isSubmitting={registrationMutation.isPending}
            />
          ) : (
            <OTPStep 
              otp={otp}
              setOtp={setOtp}
              otpInputRefs={otpInputRefs}
              onOtpChange={handleOtpChange}
              onOtpKeyDown={handleOtpKeyDown}
              otpError={otpError}
              otpVerified={otpVerified}
              isResending={isResending}
              timer={timer}
              isTimerActive={isTimerActive}
              userEmail={userEmail}
              onResendOtp={handleResendOtp}
              onBack={() => setStep('form')}
              isSubmitting={otpVerificationMutation.isPending}
            />
          )}

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/bespoke/login"
                className="font-medium text-purple-700 hover:text-purple-800 transition-colors"
              >
                Sign in
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Interested in selling ready-made items?{' '}
              <Link
                href="/seller/signup"
                className="font-medium text-blue-700 hover:text-blue-800 transition-colors"
              >
                Become a Seller
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Grow Your Business</h4>
            <p className="text-xs text-gray-600">Reach clients across Africa</p>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Secure Platform</h4>
            <p className="text-xs text-gray-600">Safe payments and transactions</p>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <Sparkles className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Showcase Craftsmanship</h4>
            <p className="text-xs text-gray-600">Highlight your unique skills</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Signup Form Component
interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  creatorTypes: Array<{id: string; label: string; icon: any; description: string}>;
  formError: string;
  isSubmitting: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  selectedCountry,
  setSelectedCountry,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  creatorTypes,
  formError,
  isSubmitting
}) => {
  const [creatorType, setCreatorType] = useState('tailor');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: SignupFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      country: formData.get('country') as string,
      city: formData.get('city') as string,
      creatorType,
      termsAccepted,
    };

    // Basic validation
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!termsAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <Sparkles className="h-5 w-5 text-purple-600 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-purple-800">Quick Signup - Just the Basics</h4>
              <p className="text-sm text-purple-700 mt-1">
                Get started in 2 minutes. Complete your profile later in your dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="name"
                type="text"
                required
                minLength={2}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>

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
                name="email"
                type="email"
                required
                pattern={emailRegex.source}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="your@email.com"
              />
            </div>
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
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
          </div>
        </div>

        {/* Phone & Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder={africanCountries.find(c => c.code === selectedCountry)?.phoneCode + " XXX XXX XXX"}
              />
            </div>
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
                name="country"
                required
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
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
                name="city"
                type="text"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Your city"
              />
            </div>
          </div>
        </div>

        {/* Creator Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What type of creator are you? *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {creatorTypes.map((type) => {
              const Icon = type.icon;
              return (
                <label
                  key={type.id}
                  className={`relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    creatorType === type.id
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="creatorType"
                    value={type.id}
                    checked={creatorType === type.id}
                    onChange={(e) => setCreatorType(e.target.value)}
                    className="sr-only"
                  />
                  <div className="p-2 bg-purple-100 rounded-lg mb-2">
                    <Icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 text-center">{type.label}</p>
                  <p className="text-xs text-gray-500 text-center mt-1 hidden md:block">{type.description}</p>
                  {creatorType === type.id && (
                    <Check className="absolute top-1 right-1 h-4 w-4 text-purple-600" />
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start">
          <input
            id="termsAccepted"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="h-4 w-4 mt-1 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-700">
            I agree to DATLEP's{' '}
            <Link href="/terms" className="text-purple-700 hover:text-purple-800">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-purple-700 hover:text-purple-800">
              Privacy Policy
            </Link>
          </label>
        </div>
      </div>

      {formError && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Signup Error</h3>
              <p className="mt-1 text-sm text-red-700">{formError}</p>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !termsAccepted}
        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors ${
          isSubmitting || !termsAccepted
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
          <>
            Continue to Email Verification
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
};

// OTP Step Component
interface OTPStepProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
  otpInputRefs: React.RefObject<(HTMLInputElement | null)[]>;
  onOtpChange: (index: number, value: string) => void;
  onOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  otpError: string;
  otpVerified: boolean;
  isResending: boolean;
  timer: number;
  isTimerActive: boolean;
  userEmail: string;
  onResendOtp: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const OTPStep: React.FC<OTPStepProps> = ({
  otp,
  setOtp,
  otpInputRefs,
  onOtpChange,
  onOtpKeyDown,
  otpError,
  otpVerified,
  isResending,
  timer,
  isTimerActive,
  userEmail,
  onResendOtp,
  onBack,
  isSubmitting
}) => {
  const handleDemoOTP = () => {
    const demoOTP = '123456';
    const otpArray = demoOTP.split('');
    setOtp(otpArray);
    
    // Auto submit after setting demo OTP
    setTimeout(() => {
      // Find the form submit logic - in this case, we need to trigger OTP submission
      if (otpArray.every(digit => digit !== '')) {
        // This would normally trigger via the handleOtpSubmit in parent
        // For now, just show that it's working
        console.log('Demo OTP set:', demoOTP);
      }
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
          <Mail className="h-6 w-6 text-purple-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Verify Your Email</h3>
        <p className="text-sm text-gray-600">
          We've sent a 6-digit OTP to:
          <br />
          <span className="font-medium text-gray-900">{userEmail}</span>
        </p>
        <p className="text-xs text-gray-500 mt-2">
          For testing, use OTP: <span className="font-mono font-bold">123456</span>
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
              onChange={(e) => onOtpChange(index, e.target.value)}
              onKeyDown={(e) => onOtpKeyDown(index, e)}
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
            <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isResending ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>

        <button
          type="button"
          onClick={handleDemoOTP}
          className="w-full mt-3 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Use Demo OTP: 123456
        </button>

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
                Email verified successfully! Redirecting to dashboard...
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting || otpVerified}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Account Details
        </button>
      </div>
    </div>
  );
};

export default BespokeSignup;