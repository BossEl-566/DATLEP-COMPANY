'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
  Scissors,
  Shirt,
  Diamond,
  Palette,
  Sparkles,
  Award,
  Check,
  AlertCircle,
  ArrowLeft,
  CreditCard,
  MapPin,
  Clock,
  Wallet,
  Shield,
  TrendingUp,
  Users,
  Package,
  Globe,
  Mail,
  Phone,
  User,
  Lock,
  Briefcase,
  Star,
  Target
} from 'lucide-react';

// Import components
import BespokeProgressStepper from '../components/BespokeProgressStepper';


// Import steppers
import AccountStepper from '../steppers/AccountStepper';
import ProfileStepper from '../steppers/ProfileStepper';
import ServicesStepper from '../steppers/ServicesStepper';
import PaymentStepper from '../steppers/PaymentStepper';

// Import utilities
import { africanCountries } from '../signup/utils/countries';
import logo from '../../assets/images/datlep-logo.png';


const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

// Types
export type BespokeSpecialization = 
  'tailor' | 'shoemaker' | 'leather-worker' | 'jewelry-maker' | 
  'embroidery-artist' | 'knitting-expert' | 'weaving-specialist' | 
  'dressmaker' | 'suits-specialist' | 'wedding-attire' | 
  'traditional-wear' | 'children-wear' | 'costume-designer';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'experienced' | 'expert' | 'master';
export type PricingModel = 'hourly' | 'fixed' | 'project-based' | 'custom';
export type ResponseTime = 'within-hours' | 'within-day' | '1-2-days' | '3-plus-days';
export type Proficiency = 'basic' | 'intermediate' | 'advanced' | 'expert';
export type PaymentMethod = 'bank-transfer' | 'card' | 'mobile-money' | 'platform-wallet';

export interface Skill {
  name: string;
  proficiency: Proficiency;
  yearsOfExperience?: number;
}

export interface Service {
  name: string;
  description: string;
  basePrice: number;
  timeRequired: string;
  isAvailable: boolean;
}

export interface ConsultationHour {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface ShippingOption {
  destination: string;
  cost: number;
  estimatedTime: string;
}

export interface BespokeFormData {
  // Account Info
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  country: string;
  city: string;
  
  // Profile
  specialization: BespokeSpecialization;
  businessName: string;
  tagline: string;
  bio: string;
  experience: ExperienceLevel;
  yearsOfExperience: number;
  
  // Skills
  skills: Skill[];
  techniques: string[];
  materialsExpertise: string[];
  
  // Services
  services: Service[];
  customizationOptions: {
    measurements: boolean;
    fabricSelection: boolean;
    designConsultation: boolean;
    multipleRevisions: boolean;
    rushOrders: boolean;
  };
  
  // Pricing
  pricingModel: PricingModel;
  minimumOrderValue: number;
  depositPercentage: number;
  
  // Availability
  responseTime: ResponseTime;
  consultationHours: ConsultationHour[];
  languages: string[];
  
  // Location
  workshopLocation: {
    city: string;
    country: string;
    acceptsLocalClients: boolean;
    acceptsInternationalClients: boolean;
  };
  shippingOptions: ShippingOption[];
  
  // Fitting
  fittingOptions: ('virtual' | 'in-person' | 'send-garment' | 'standard-size')[];
  
  // Payment
  paymentMethods: PaymentMethod[];
  preferredCurrency: string;
  
  // Terms
  termsAccepted: boolean;
}

// API Types
type RegistrationRequest = {
  name: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  city: string;
  specialization: BespokeSpecialization;
};

type OTPVerificationRequest = RegistrationRequest & {
  otp: string;
};

const BespokeSignup = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [signupStep, setSignupStep] = useState<'form' | 'otp' | 'profile' | 'services' | 'payment'>('form');
  const [formError, setFormError] = useState('');
  const [userData, setUserData] = useState<RegistrationRequest | null>(null);
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('NG');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Mutation for registration (sends OTP)
  const registrationMutation = useMutation({
    mutationFn: async (data: RegistrationRequest) => {
      const response = await api.post('/send-bespoke-otp', data);
      return response.data;
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Failed to process registration');
    },
  });

  // Mutation for OTP verification
  const otpVerificationMutation = useMutation({
    mutationFn: async (data: OTPVerificationRequest) => {
      const response = await api.post('/verify-bespoke-otp', data);
      return response.data;
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Failed to verify OTP');
    },
  });

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

  // Specializations with icons
  const specializations = [
    { id: 'tailor', label: 'Tailor', icon: Scissors, description: 'Custom clothing alterations and tailoring' },
    { id: 'shoemaker', label: 'Shoemaker', icon: Shirt, description: 'Handcrafted footwear and repairs' },
    { id: 'leather-worker', label: 'Leather Worker', icon: Package, description: 'Leather goods and accessories' },
    { id: 'jewelry-maker', label: 'Jewelry Maker', icon: Diamond, description: 'Handmade jewelry and accessories' },
    { id: 'embroidery-artist', label: 'Embroidery Artist', icon: Palette, description: 'Intricate embroidery and embellishments' },
    { id: 'knitting-expert', label: 'Knitting Expert', icon: Sparkles, description: 'Knitted garments and accessories' },
    { id: 'weaving-specialist', label: 'Weaving Specialist', icon: Sparkles, description: 'Traditional and modern weaving' },
    { id: 'dressmaker', label: 'Dressmaker', icon: Shirt, description: 'Custom dresses and gowns' },
    { id: 'suits-specialist', label: 'Suits Specialist', icon: Award, description: 'Custom suits and formal wear' },
    { id: 'wedding-attire', label: 'Wedding Attire', icon: Sparkles, description: 'Bridal and wedding outfits' },
    { id: 'traditional-wear', label: 'Traditional Wear', icon: Globe, description: 'Cultural and traditional clothing' },
    { id: 'children-wear', label: 'Children Wear', icon: Users, description: 'Custom clothing for children' },
    { id: 'costume-designer', label: 'Costume Designer', icon: Award, description: 'Theatrical and costume design' },
  ];

  const experienceLevels = [
    { id: 'beginner', label: 'Beginner', description: '0-2 years experience' },
    { id: 'intermediate', label: 'Intermediate', description: '2-5 years experience' },
    { id: 'experienced', label: 'Experienced', description: '5-10 years experience' },
    { id: 'expert', label: 'Expert', description: '10-15 years experience' },
    { id: 'master', label: 'Master', description: '15+ years experience' },
  ];

  const handleAccountSubmit = async (data: Partial<BespokeFormData>) => {
      console.log('Form data received:', data);
    setFormError('');
    
    try {
      const registrationData: RegistrationRequest = {
        name: data.name!,
        email: data.email!,
        password: data.password!,
        phone: data.phone!,
        country: data.country!,
        city: data.city!,
        specialization: data.specialization!,
      };

      const response = await registrationMutation.mutateAsync(registrationData);
      
      setUserData(registrationData);
      setSignupStep('otp');
      setIsTimerActive(true);
      setTimer(60);
      
    } catch (error: any) {
      setFormError(error.message);
    }
  };

  const handleProfileSubmit = async (data: Partial<BespokeFormData>) => {
    // Handle profile data submission
    setSignupStep('services');
    setCurrentStep(3);
  };

  const handleServicesSubmit = async (data: Partial<BespokeFormData>) => {
    // Handle services data submission
    setSignupStep('payment');
    setCurrentStep(4);
  };

  const handlePaymentSubmit = async (data: Partial<BespokeFormData>) => {
    // Complete signup and redirect
    router.push('/bespoke/dashboard');
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
  };

  const handleOtpSubmit = async (enteredOtp: string) => {
  if (!userData) return;
  
  setOtpError('');
  
  try {
    const verificationData = {
      ...userData,
      otp: enteredOtp
    };

    const response = await otpVerificationMutation.mutateAsync(verificationData);
    
    if (response.creator?.id) {
      setCreatorId(response.creator.id);
    }
    
    if (response.token) {
      localStorage.setItem('bespoke_token', response.token);
    }

    setOtpVerified(true);
    
    // Move to profile setup step
    setTimeout(() => {
      setSignupStep('profile');
      setCurrentStep(2);
    }, 1000);
    
  } catch (error: any) {
    setOtpError(error.message);
  }
};

  const renderStepContent = () => {
    switch (signupStep) {
      case 'otp':
        return <AccountStepper 
          otp={otp}
          setOtp={setOtp}
          otpError={otpError}
          otpVerified={otpVerified}
          isResending={isResending}
          timer={timer}
          isTimerActive={isTimerActive}
          userData={userData}
          onOtpSubmit={handleOtpSubmit}
          onResendOtp={() => {
            // Implement resend logic
            setIsResending(true);
            setTimeout(() => setIsResending(false), 1000);
          }}
          onBack={() => setSignupStep('form')}
        />;
      case 'profile':
        return <ProfileStepper 
          specializations={specializations}
          // experienceLevels={experienceLevels}
          africanCountries={africanCountries}
          selectedCountry={selectedCountry}
          onCountryChange={handleCountryChange}
          onSubmit={handleProfileSubmit}
        />;
      case 'services':
        return <ServicesStepper 
          onSubmit={handleServicesSubmit}
        />;
      case 'payment':
        return <PaymentStepper 
          onSubmit={handlePaymentSubmit}
        />;
      default:
        return <AccountStepper 
          // specializations={specializations}
          africanCountries={africanCountries}
          selectedCountry={selectedCountry}
          onCountryChange={handleCountryChange}
          onSubmit={handleAccountSubmit}
          isSubmitting={registrationMutation.isPending}
          formError={formError}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
          Become a Bespoke Creator
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Showcase your craftsmanship and connect with clients
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-5xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-200">
          {/* Progress Stepper */}
          <BespokeProgressStepper 
            currentStep={currentStep}
            signupStep={signupStep}
          />

          {/* Current Step Content */}
          {renderStepContent()}

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have a creator account?{' '}
              <Link
                href="/bespoke/login"
                className="font-medium text-purple-700 hover:text-purple-800 transition-colors"
              >
                Sign in here
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Sell ready-made fashion items?{' '}
              <Link
                href="/seller/signup"
                className="font-medium text-blue-700 hover:text-blue-800 transition-colors"
              >
                Become a Fashion Seller
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Verified Profile</h4>
            <p className="text-xs text-gray-600">Build trust with verified credentials</p>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Direct Clients</h4>
            <p className="text-xs text-gray-600">Connect directly with clients worldwide</p>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <Wallet className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Secure Payments</h4>
            <p className="text-xs text-gray-600">Safe transactions with deposit protection</p>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <TrendingUp className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Premium Pricing</h4>
            <p className="text-xs text-gray-600">Set premium prices for your craftsmanship</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BespokeSignup;