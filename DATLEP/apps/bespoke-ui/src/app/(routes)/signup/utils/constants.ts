// app/bespoke/signup/utils/constants.ts
import {
  Scissors,
  Package,
  Gem,
  Users,
  Clock4,
  DollarSign,
  FileText,
  Zap,
  Camera,
  Ruler,
  Truck,
  Building,
  CreditCard,
  Smartphone,
  Wallet,
} from 'lucide-react';

// Specialization options
export const specializations = [
  { id: 'tailor', label: 'Tailor', icon: Scissors, description: 'Custom clothing and alterations' },
  { id: 'shoemaker', label: 'Shoemaker', icon: Package, description: 'Custom footwear and repairs' },
  { id: 'leather-worker', label: 'Leather Worker', icon: Gem, description: 'Leather goods and accessories' },
  // ... add rest of specializations
];

// Experience levels
export const experienceLevels = [
  { id: 'beginner', label: 'Beginner (0-2 years)', description: 'Just starting out' },
  { id: 'intermediate', label: 'Intermediate (2-5 years)', description: 'Some professional experience' },
  { id: 'experienced', label: 'Experienced (5-10 years)', description: 'Well-established professional' },
  { id: 'expert', label: 'Expert (10-15 years)', description: 'Master of the craft' },
  { id: 'master', label: 'Master (15+ years)', description: 'Renowned master artisan' }
];

// Pricing models
export const pricingModels = [
  { id: 'hourly', label: 'Hourly Rate', icon: Clock4, description: 'Charge by the hour' },
  { id: 'fixed', label: 'Fixed Price', icon: DollarSign, description: 'Set price per project' },
  { id: 'project-based', label: 'Project-Based', icon: FileText, description: 'Price based on project scope' },
  { id: 'custom', label: 'Custom Pricing', icon: Zap, description: 'Custom quotes for each client' }
];

// Response times
export const responseTimes = [
  { id: 'within-hours', label: 'Within a few hours', description: 'Quick response' },
  { id: 'within-day', label: 'Within 24 hours', description: 'Same day response' },
  { id: '1-2-days', label: '1-2 business days', description: 'Standard response' },
  { id: '3-plus-days', label: '3+ business days', description: 'Longer response time' }
];

// Fitting options
export const fittingOptions = [
  { id: 'virtual', label: 'Virtual Fitting', icon: Camera, description: 'Video consultation' },
  { id: 'in-person', label: 'In-Person Fitting', icon: Users, description: 'Studio appointment' },
  { id: 'send-garment', label: 'Send Garment', icon: Truck, description: 'Client sends garment' },
  { id: 'standard-size', label: 'Standard Sizes', icon: Ruler, description: 'Use standard measurements' }
];

// Payment methods
export const paymentMethods = [
  { id: 'bank-transfer', label: 'Bank Transfer', icon: Building },
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
  { id: 'mobile-money', label: 'Mobile Money', icon: Smartphone },
  { id: 'platform-wallet', label: 'Platform Wallet', icon: Wallet }
];

// Days of week
export const daysOfWeek = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' }
];

// Import from your existing utils
export { currencies } from '../../../../utils/currencies';
export { languages } from '../../../../utils/languages';
export { africanCountries } from '../../../shared/types/countries';