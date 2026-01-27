// app/bespoke/signup/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
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
  Check,
  X,
  AlertCircle,
  Clock,
  RefreshCw,
  Timer,
  Smartphone,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  Award,
  Briefcase,
  MapPin,
  Globe,
  Phone,
  Calendar,
  DollarSign,
  Package,
  Scissors,
  Ruler,
  Palette,
  Truck,
  Shield,
  CreditCard,
  Upload,
  Star,
  Users,
  Target,
  Sparkles,
  HeartHandshake,
  Gem,
  FileText,
  Camera,
  Plus,
  Trash2,
  Clock4,
  Banknote,
  Wallet,
  Zap,
  Globe2,
  Languages,
  Compass,
  Building,
  Factory,
  Home,
  Store
} from 'lucide-react';
import logo from '../../assets/images/datlep-logo.png';

// Import reusable components
import StepperProgress from '../../shared/components/StepperProgress';
import FormInput from '../../shared/components/FormInput';
import FormSelect from '../../shared/components/FormSelect';
import FormTextarea from '../../shared/components/FormTextarea';
import FormCheckbox from '../../shared/components/FormCheckbox';
import CountrySelect from '../../shared/components/CountrySelect';
import TimeSelect from '../../shared/components/TimeSelect';
import FileUpload from '../../shared/components/FileUpload';
import SkillInput from '../../shared/components/SkillInput';
import {proficiencyLevels as allProficiencyLevels } from '../../shared/constants/proficiencyLevels';


// Import types and utilities
import {
  BespokeFormData,
  Specialization,
  ExperienceLevel,
  ProficiencyLevel,
  PricingModel,
  ResponseTime,
  FittingOption,
  PaymentMethod,
  Service,
  Skill,
  PortfolioItem,
  ConsultationHour,
  ShippingOption,
  AwardType,
  FeaturedInType
} from '../../shared/types/bespoke';
import { africanCountries } from '../../shared/types/countries';
import { daysOfWeek } from '../../../utils/daysOfWeek';
import { currencies } from '../../../utils/currencies';
import { languages } from '../../../utils/languages';

// Import specialized components
import PortfolioUpload from '../../shared/components/PortfolioUpload';
import ServicesManager from '../../shared/components/ServicesManager';
import SkillsManager from '../../shared/components/SkillsManager';
import ConsultationHours from '../../shared/components/ConsultationHours';
import ShippingOptions from '../../shared/components/ShippingOptions';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

type LocalFittingOption = 'virtual' | 'in-person' | 'send-garment' | 'standard-size';
type LocalPaymentMethod = 'bank-transfer' | 'card' | 'mobile-money' | 'platform-wallet';




// Specialization options
const specializations = [
  { id: 'tailor', label: 'Tailor', icon: Scissors, description: 'Custom clothing and alterations' },
  { id: 'shoemaker', label: 'Shoemaker', icon: Package, description: 'Custom footwear and repairs' },
  { id: 'leather-worker', label: 'Leather Worker', icon: Gem, description: 'Leather goods and accessories' },
  { id: 'jewelry-maker', label: 'Jewelry Maker', icon: Gem, description: 'Custom jewelry and repairs' },
  { id: 'embroidery-artist', label: 'Embroidery Artist', icon: Sparkles, description: 'Embroidery and embellishments' },
  { id: 'knitting-expert', label: 'Knitting Expert', icon: HeartHandshake, description: 'Knitted items and patterns' },
  { id: 'weaving-specialist', label: 'Weaving Specialist', icon: Target, description: 'Woven textiles and fabrics' },
  { id: 'dressmaker', label: 'Dressmaker', icon: Users, description: 'Custom dresses and formal wear' },
  { id: 'suits-specialist', label: 'Suits Specialist', icon: Briefcase, description: 'Custom suits and tailoring' },
  { id: 'wedding-attire', label: 'Wedding Attire', icon: Award, description: 'Wedding dresses and attire' },
  { id: 'traditional-wear', label: 'Traditional Wear', icon: Globe2, description: 'Traditional and cultural attire' },
  { id: 'children-wear', label: 'Children Wear', icon: Users, description: "Children's clothing and accessories" },
  { id: 'costume-designer', label: 'Costume Designer', icon: Palette, description: 'Theatrical and costume design' }
];

// Experience levels
const experienceLevels = [
  { id: 'beginner', label: 'Beginner (0-2 years)', description: 'Just starting out' },
  { id: 'intermediate', label: 'Intermediate (2-5 years)', description: 'Some professional experience' },
  { id: 'experienced', label: 'Experienced (5-10 years)', description: 'Well-established professional' },
  { id: 'expert', label: 'Expert (10-15 years)', description: 'Master of the craft' },
  { id: 'master', label: 'Master (15+ years)', description: 'Renowned master artisan' }
];

// Proficiency levels
const proficiencyLevels = [
  { id: 'basic', label: 'Basic' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'expert', label: 'Expert' }
];

// Pricing models
const pricingModels = [
  { id: 'hourly', label: 'Hourly Rate', icon: Clock4, description: 'Charge by the hour' },
  { id: 'fixed', label: 'Fixed Price', icon: DollarSign, description: 'Set price per project' },
  { id: 'project-based', label: 'Project-Based', icon: FileText, description: 'Price based on project scope' },
  { id: 'custom', label: 'Custom Pricing', icon: Zap, description: 'Custom quotes for each client' }
];

// Response times
const responseTimes = [
  { id: 'within-hours', label: 'Within a few hours', description: 'Quick response' },
  { id: 'within-day', label: 'Within 24 hours', description: 'Same day response' },
  { id: '1-2-days', label: '1-2 business days', description: 'Standard response' },
  { id: '3-plus-days', label: '3+ business days', description: 'Longer response time' }
];

// Fitting options
const fittingOptions: { id: FittingOption; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; description: string }[] = [
  { id: 'virtual', label: 'Virtual Fitting', icon: Camera, description: 'Video consultation' },
  { id: 'in-person', label: 'In-Person Fitting', icon: Users, description: 'Studio appointment' },
  { id: 'send-garment', label: 'Send Garment', icon: Truck, description: 'Client sends garment' },
  { id: 'standard-size', label: 'Standard Sizes', icon: Ruler, description: 'Use standard measurements' }
];


// Payment methods
const paymentMethods: {
  id: PaymentMethod;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}[] = [
  { id: 'bank-transfer', label: 'Bank Transfer', icon: Building },
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
  { id: 'mobile-money', label: 'Mobile Money', icon: Smartphone },
  { id: 'platform-wallet', label: 'Platform Wallet', icon: Wallet }
];


const BespokeSignup = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [signupStep, setSignupStep] = useState<'form' | 'otp' | 'profile' | 'services' | 'portfolio' | 'bank'>('form');
  
  // OTP State
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [isOtpLocked, setIsOtpLocked] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  
  // Form State
  const [selectedCountry, setSelectedCountry] = useState('NG');
  const [userData, setUserData] = useState<any>(null);
  const [bespokeCreatorId, setBespokeCreatorId] = useState<string | null>(null);
  
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
    getValues,
  } = useForm<BespokeFormData>({
    mode: 'onChange',
    defaultValues: {
      // Step 1: Account
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      country: 'NG',
      city: '',
      termsAccepted: false,
      
      // Step 2: Profile
      specialization: 'tailor',
      businessName: '',
      tagline: '',
      bio: '',
      experience: 'beginner',
      yearsOfExperience: 1,
      skills: [],
      techniques: [],
      materialsExpertise: [],
      languages: ['English'],
      
      // Step 3: Services & Pricing
      services: [{
        name: '',
        description: '',
        basePrice: 0,
        timeRequired: '',
        isAvailable: true
      }],
      customizationOptions: {
        measurements: true,
        fabricSelection: true,
        designConsultation: true,
        multipleRevisions: false,
        rushOrders: false
      },
      pricingModel: 'fixed',
      minimumOrderValue: 0,
      depositPercentage: 50,
      
      // Step 4: Business Details
      responseTime: 'within-day',
      consultationHours: daysOfWeek.map(day => ({
        day: day.id,
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: day.id !== 'sunday'
      })),
      workshopLocation: {
        city: '',
        country: 'NG',
        acceptsLocalClients: true,
        acceptsInternationalClients: false
      },
      shippingOptions: [],
      fittingOptions: ['virtual', 'in-person'],
      paymentMethods: ['bank-transfer'],
      preferredCurrency: 'NGN',
      
      // Step 5: Portfolio
      portfolio: [],
      
      // Step 6: Verification & Bank
      awards: [],
      featuredIn: []
    },
  });

  // Create axios instance
  const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
      'Content-Type': 'application/json',
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

  // Step Titles
  const stepTitles = [
    'Create Account',
    'Build Profile',
    'Services & Pricing',
    'Business Setup',
    'Portfolio',
    'Verification & Bank'
  ];

  // Step Icons
  const stepIcons = [User, Briefcase, DollarSign, Building, Camera, Shield];

  // Watch values
  const password = watch('password');
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
      // Handle OTP verification
      setOtpVerified(true);
      setOtpAttempts(0);
      
      // Move to profile setup step
      setTimeout(() => {
        setSignupStep('profile');
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
      // Resend OTP logic here
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
    setValue('workshopLocation.country', countryCode);
    trigger(['country', 'workshopLocation.country']);
  };

  // Form Submission Handlers
  const onAccountSubmit: SubmitHandler<BespokeFormData> = async (data) => {
    setFormError('');
    
    try {
      // Save user data and proceed to OTP
      setUserData(data);
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

  const onProfileSubmit: SubmitHandler<BespokeFormData> = async (data) => {
    try {
      // Save profile data and move to services
      setCurrentStep(3);
      setSignupStep('services');
    } catch (error: any) {
      setFormError(error.message);
    }
  };

  const onServicesSubmit: SubmitHandler<BespokeFormData> = async (data) => {
    try {
      // Save services data and move to business setup
      setCurrentStep(4);
      setSignupStep('portfolio');
    } catch (error: any) {
      setFormError(error.message);
    }
  };

  const onBusinessSubmit: SubmitHandler<BespokeFormData> = async (data) => {
    try {
      // Save business data and move to portfolio
      setCurrentStep(5);
      setSignupStep('portfolio');
    } catch (error: any) {
      setFormError(error.message);
    }
  };

  const onPortfolioSubmit: SubmitHandler<BespokeFormData> = async (data) => {
    try {
      // Save portfolio and move to final step
      setCurrentStep(6);
      setSignupStep('bank');
    } catch (error: any) {
      setFormError(error.message);
    }
  };

  const onFinalSubmit: SubmitHandler<BespokeFormData> = async (data) => {
    try {
      // Submit all data and create bespoke creator profile
      // This would be your API call to create the bespoke creator
      router.push('/bespoke/dashboard');
    } catch (error: any) {
      setFormError(error.message);
    }
  };

  // Step 1: Account Creation
  const renderStep1 = () => (
    <form onSubmit={handleSubmit(onAccountSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Step 1: Create Your Creator Account</h4>
              <p className="text-sm text-blue-700 mt-1">
                Set up your basic account information. You'll verify your email before building your creator profile.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Full Name *"
            name="name"
            register={register}
            errors={errors}
            icon={User}
            required
            placeholder="John Doe"
            validation={{
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            }}
          />

          <FormInput
            label="Email Address *"
            name="email"
            type="email"
            register={register}
            errors={errors}
            icon={Mail}
            required
            placeholder="creator@example.com"
            validation={{
              required: 'Email is required',
              pattern: { value: emailRegex, message: 'Please enter a valid email' }
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Password *"
            name="password"
            type={showPassword ? 'text' : 'password'}
            register={register}
            errors={errors}
            icon={Lock}
            required
            showPasswordToggle
            onTogglePassword={() => setShowPassword(!showPassword)}
            placeholder="At least 6 characters"
            validation={{
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            }}
          />

          <FormInput
            label="Confirm Password *"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            register={register}
            errors={errors}
            icon={Lock}
            required
            showPasswordToggle
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            placeholder="Confirm your password"
            validation={{
  required: 'Please confirm your password',
  validate: (value: string) =>
    value === password || 'Passwords do not match',
}}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Phone Number *"
            name="phone"
            type="tel"
            register={register}
            errors={errors}
            icon={Phone}
            required
            placeholder={africanCountries.find(c => c.code === selectedCountry)?.phoneCode + " XXX XXX XXX"}
            validation={{
              required: 'Phone number is required',
              pattern: { value: phoneRegex, message: 'Please enter a valid phone number' }
            }}
          />

          <CountrySelect
            label="Country *"
            name="country"
            value={selectedCountry}
            onChange={handleCountryChange}
            countries={africanCountries}
            icon={Globe}
            required
          />
        </div>

        <div>
          <FormInput
            label="City *"
            name="city"
            register={register}
            errors={errors}
            icon={MapPin}
            required
            placeholder="Your city"
            validation={{
              required: 'City is required'
            }}
          />
        </div>

        <FormCheckbox
          name="termsAccepted"
          register={register}
          errors={errors}
          required
          label={
            <>
              I agree to DATLEP's{' '}
              <Link href="/bespoke/terms" className="text-blue-700 hover:text-blue-800">
                Creator Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-700 hover:text-blue-800">
                Privacy Policy
              </Link>
            </>
          }
        />
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
        disabled={!isValid}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
          !isValid
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-700 hover:bg-blue-800'
        }`}
      >
        Continue to Email Verification
      </button>
    </form>
  );

  // Step 2: Profile Setup
  const renderStep2 = () => (
    <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <Briefcase className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Step 2: Build Your Creator Profile</h4>
              <p className="text-sm text-blue-700 mt-1">
                Showcase your expertise, skills, and what makes you unique as a creator.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Specialization *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {specializations.map((spec) => {
              const Icon = spec.icon;
              return (
                <label
                  key={spec.id}
                  className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                    watch('specialization') === spec.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
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
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{spec.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{spec.description}</p>
                    </div>
                  </div>
                  {watch('specialization') === spec.id && (
                    <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-blue-600" />
                  )}
                </label>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Business Name (Optional)"
            name="businessName"
            register={register}
            errors={errors}
            icon={Store}
            placeholder="Your brand or studio name"
          />

          <FormInput
            label="Tagline (Optional)"
            name="tagline"
            register={register}
            errors={errors}
            icon={Sparkles}
            placeholder="Short description of your work"
            maxLength={200}
          />
        </div>

        <FormTextarea<BespokeFormData>
  label="About You & Your Craft *"
  name="bio"
  register={register}
  errors={errors}
  control={control}
  required
  rows={4}
  placeholder="Tell us about your journey, inspiration, and what makes your creations special..."
  maxLength={1000}
  showCounter
/>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Experience Level *"
            name="experience"
            register={register}
            errors={errors}
            required
            options={experienceLevels}
          />

          <FormInput
            label="Years of Experience *"
            name="yearsOfExperience"
            type="number"
            register={register}
            errors={errors}
            required
            icon={Calendar}
            min={0}
            max={50}
            validation={{
              required: 'Years of experience is required',
              min: { value: 0, message: 'Must be 0 or more' },
              max: { value: 50, message: 'Maximum 50 years' }
            }}
          />
        </div>

        <Controller
          name="skills"
          control={control}
          render={({ field }) => (
            <SkillsManager
              skills={field.value}
              onChange={field.onChange}
              proficiencyLevels={allProficiencyLevels}
            />
          )}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Techniques You Use (Optional)
          </label>
          <Controller
            name="techniques"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                {field.value.map((technique, index) => (
                  <input
                    key={index}
                    type="text"
                    value={technique}
                    onChange={(e) => {
                      const newTechniques = [...field.value];
                      newTechniques[index] = e.target.value;
                      field.onChange(newTechniques);
                    }}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Hand-stitching, Laser cutting"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => field.onChange([...field.value, ''])}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Technique
                </button>
              </div>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Languages You Speak *
          </label>
          <div className="flex flex-wrap gap-2">
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                onClick={() => {
                  const current = watch('languages');
                  if (current.includes(language.code)) {
                    setValue('languages', current.filter(l => l !== language.code));
                  } else {
                    setValue('languages', [...current, language.code]);
                  }
                }}
                className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                  watch('languages').includes(language.code)
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                <Languages className="h-4 w-4 mr-2" />
                {language.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        Continue to Services & Pricing
      </button>
    </form>
  );

  // Step 3: Services & Pricing
  const renderStep3 = () => (
    <form onSubmit={handleSubmit(onServicesSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <DollarSign className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Step 3: Define Your Services & Pricing</h4>
              <p className="text-sm text-blue-700 mt-1">
                Set up the services you offer and your pricing structure.
              </p>
            </div>
          </div>
        </div>

        <Controller
          name="services"
          control={control}
          render={({ field }) => (
            <ServicesManager
              services={field.value}
              onChange={field.onChange}
              currencies={currencies}
            />
          )}
        />

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Customization Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormCheckbox<BespokeFormData>
  name="customizationOptions.measurements"
  register={register}
  errors={errors} // <-- you must include this
  label="Custom Measurements"
/>

         <FormCheckbox<BespokeFormData>
  name="customizationOptions.fabricSelection"
  register={register}
  errors={errors}
  label="Fabric Selection"
/>
<FormCheckbox<BespokeFormData>
  name="customizationOptions.designConsultation"
  register={register}
  errors={errors}
  label="Design Consultation"
/>
<FormCheckbox<BespokeFormData>
  name="customizationOptions.multipleRevisions"
  register={register}
  errors={errors}
  label="Multiple Revisions"
/>
<FormCheckbox<BespokeFormData>
  name="customizationOptions.rushOrders"
  register={register}
  errors={errors}
  label="Rush Orders"
/>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pricing Model *
            </label>
            <div className="space-y-2">
              {pricingModels.map((model) => {
                const Icon = model.icon;
                return (
                  <label
                    key={model.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                      watch('pricingModel') === model.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register('pricingModel', { required: true })}
                      value={model.id}
                      className="sr-only"
                    />
                    <Icon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{model.label}</p>
                      <p className="text-xs text-gray-500">{model.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <FormInput
              label="Minimum Order Value"
              name="minimumOrderValue"
              type="number"
              register={register}
              errors={errors}
              icon={DollarSign}
              min={0}
              step="0.01"
              placeholder="0.00"
              helpText="Minimum amount required to start a project"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deposit Percentage *
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  {...register('depositPercentage', {
                    required: true,
                    min: 0,
                    max: 100
                  })}
                  className="flex-1"
                />
                <span className="ml-4 text-lg font-semibold text-blue-600">
                  {watch('depositPercentage')}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Percentage required upfront to start a project
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        Continue to Business Setup
      </button>
    </form>
  );

  // Step 4: Business Setup
  const renderStep4 = () => (
    <form onSubmit={handleSubmit(onBusinessSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <Building className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Step 4: Setup Your Business Operations</h4>
              <p className="text-sm text-blue-700 mt-1">
                Configure how you work with clients and handle business operations.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Response Time *"
            name="responseTime"
            register={register}
            errors={errors}
            required
            options={responseTimes}
          />

          <FormSelect
            label="Preferred Currency *"
            name="preferredCurrency"
            register={register}
            errors={errors}
            required
            options={currencies}
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Consultation Hours</h3>
          <Controller
            name="consultationHours"
            control={control}
            render={({ field }) => (
              <ConsultationHours
                hours={field.value}
                onChange={field.onChange}
                days={daysOfWeek}
              />
            )}
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Workshop Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="City"
              name="workshopLocation.city"
              register={register}
              errors={errors}
              icon={MapPin}
              placeholder="Workshop city"
            />

            <CountrySelect
              label="Country"
              name="workshopLocation.country"
              value={watch('workshopLocation.country')}
              onChange={(value) => setValue('workshopLocation.country', value)}
              countries={africanCountries}
              icon={Globe}
            />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormCheckbox<BespokeFormData>
  name="workshopLocation.acceptsLocalClients"
  register={register}
  errors={errors}
  label="Accept Local Clients"
/>

<FormCheckbox<BespokeFormData>
  name="workshopLocation.acceptsInternationalClients"
  register={register}
  errors={errors}
  label="Accept International Clients"
/>

          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Fitting Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {fittingOptions.map((option) => {
              const Icon = option.icon;
              return (
                <label
                  key={option.id}
                  className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer ${
                    watch('fittingOptions').includes(option?.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    {...register('fittingOptions')}
                    value={option.id}
                    className="sr-only"
                    checked={watch('fittingOptions').includes(option?.id)}
                    onChange={(e) => {
                      const current = watch('fittingOptions');
                      if (e.target.checked) {
                        setValue('fittingOptions', [...current, option?.id]);
                      } else {
                        setValue('fittingOptions', current.filter(id => id !== option.id));
                      }
                    }}
                  />
                  <Icon className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-900">{option.label}</p>
                  <p className="text-xs text-gray-500 text-center mt-1">{option.description}</p>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Shipping Options</h3>
          <Controller
            name="shippingOptions"
            control={control}
            render={({ field }) => (
              <ShippingOptions
                options={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Payment Methods *</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <label
                  key={method.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                    watch('paymentMethods').includes(method.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    {...register('paymentMethods')}
                    value={method.id}
                    className="sr-only"
                    checked={watch('paymentMethods').includes(method?.id)}
                    onChange={(e) => {
                      const current = watch('paymentMethods');
                      if (e.target.checked) {
                        setValue('paymentMethods', [...current, method?.id]);
                      } else {
                        setValue('paymentMethods', current.filter(id => id !== method.id));
                      }
                    }}
                  />
                  <Icon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">{method.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        Continue to Portfolio
      </button>
    </form>
  );

  // Step 5: Portfolio
  const renderStep5 = () => (
    <form onSubmit={handleSubmit(onPortfolioSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <Camera className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Step 5: Showcase Your Work</h4>
              <p className="text-sm text-blue-700 mt-1">
                Upload your best work to showcase your skills and attract clients.
              </p>
            </div>
          </div>
        </div>

        <Controller
          name="portfolio"
          control={control}
          render={({ field }) => (
            <PortfolioUpload
              portfolio={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Awards & Recognition (Optional)</h3>
          <Controller
            name="awards"
            control={control}
            render={({ field }) => (
              <div className="space-y-3">
                {field.value.map((award, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Award className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={award.name}
                        onChange={(e) => {
                          const newAwards = [...field.value];
                          newAwards[index] = { ...award, name: e.target.value };
                          field.onChange(newAwards);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Award name"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => field.onChange(field.value.filter((_, i) => i !== index))}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => field.onChange([...field.value, { name: '', year: new Date().getFullYear(), organization: '' }])}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Award
                </button>
              </div>
            )}
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Featured In (Optional)</h3>
          <Controller
            name="featuredIn"
            control={control}
            render={({ field }) => (
              <div className="space-y-3">
                {field.value.map((feature, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-2">
                    <input
                      type="text"
                      value={feature.platform}
                      onChange={(e) => {
                        const newFeatures = [...field.value];
                        newFeatures[index] = { ...feature, platform: e.target.value };
                        field.onChange(newFeatures);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Platform (e.g., Vogue, Instagram)"
                    />
                    <input
                      type="url"
                      value={feature.url}
                      onChange={(e) => {
                        const newFeatures = [...field.value];
                        newFeatures[index] = { ...feature, url: e.target.value };
                        field.onChange(newFeatures);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="URL"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => field.onChange([...field.value, { platform: '', url: '', description: '' }])}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </button>
              </div>
            )}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        Continue to Verification & Bank
      </button>
    </form>
  );

  // Step 6: OTP Verification
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
              disabled={isOtpLocked || otpVerified}
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
            disabled={isTimerActive || isOtpLocked || isResending || otpVerified}
            className={`text-sm font-medium flex items-center ${
              isTimerActive || isOtpLocked || isResending || otpVerified
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-700 hover:text-blue-800'
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
      </div>

      <button
        type="button"
        onClick={() => setSignupStep('form')}
        disabled={otpVerified}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Account Details
      </button>
    </div>
  );

  // Step 7: Final Step - Connect Bank
  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Complete Your Profile</h3>
          <p className="text-sm text-gray-600 mb-4">
            Connect your bank account to start receiving payments for your creations.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Profile Completion</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Account Information</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Creator Profile</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Services & Pricing</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Business Setup</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Portfolio</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Bank Connection</span>
              <span className="text-sm text-blue-600">Pending</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Banknote className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Secure Payment Processing</h4>
              <p className="text-sm text-blue-700 mt-1">
                Your bank details are encrypted and securely stored. We use bank-level security to protect your information.
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
  onClick={handleSubmit(onFinalSubmit)}
  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
>
  Complete Registration & Go to Dashboard
</button>

    </div>
  );

  // Render current step based on state
  const renderCurrentStep = () => {
    if (signupStep === 'otp') {
      return renderOTPVerification();
    }

    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
          Showcase your craftsmanship and connect with clients who value custom creations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-200">
          {/* Progress Stepper */}
          <StepperProgress
            currentStep={currentStep}
            steps={stepTitles}
            icons={stepIcons}
            maxSteps={6}
          />

          {/* Current Step Content */}
          <div className="mt-8">
            {renderCurrentStep()}
          </div>

          {/* Navigation Buttons for non-OTP steps */}
          {signupStep !== 'otp' && currentStep > 1 && currentStep < 6 && (
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(currentStep - 1);
                  if (currentStep === 2) setSignupStep('form');
                  else if (currentStep === 3) setSignupStep('profile');
                  else if (currentStep === 4) setSignupStep('services');
                  else if (currentStep === 5) setSignupStep('portfolio');
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous Step
              </button>
              
              <div className="text-sm text-gray-500">
                Step {currentStep} of 6
              </div>
            </div>
          )}

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have a creator account?{' '}
              <Link
                href="/bespoke/login"
                className="font-medium text-blue-700 hover:text-blue-800 transition-colors"
              >
                Sign in here
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Want to sell ready-made products?{' '}
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <Sparkles className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Showcase Your Craft</h4>
            <p className="text-xs text-gray-600">Display your unique creations and craftsmanship</p>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Connect with Clients</h4>
            <p className="text-xs text-gray-600">Find clients who appreciate custom, handcrafted work</p>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
            <Banknote className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">Fair Pricing</h4>
            <p className="text-xs text-gray-600">Set your own prices and earn what you deserve</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BespokeSignup;