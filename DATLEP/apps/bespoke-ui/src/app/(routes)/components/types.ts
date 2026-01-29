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
export type FittingOption = 'virtual' | 'in-person' | 'send-garment' | 'standard-size';

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
  fittingOptions: FittingOption[];
  
  // Payment
  paymentMethods: PaymentMethod[];
  preferredCurrency: string;
  
  // Terms
  termsAccepted: boolean;
}