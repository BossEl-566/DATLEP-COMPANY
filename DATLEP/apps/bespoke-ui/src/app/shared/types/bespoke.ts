// types/bespoke.ts
export type Specialization = 
  | 'tailor'
  | 'shoemaker'
  | 'leather-worker'
  | 'jewelry-maker'
  | 'embroidery-artist'
  | 'knitting-expert'
  | 'weaving-specialist'
  | 'dressmaker'
  | 'suits-specialist'
  | 'wedding-attire'
  | 'traditional-wear'
  | 'children-wear'
  | 'costume-designer';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'experienced' | 'expert' | 'master';
export type ProficiencyLevel = 'basic' | 'intermediate' | 'advanced' | 'expert';
export type PricingModel = 'hourly' | 'fixed' | 'project-based' | 'custom';
export type ResponseTime = 'within-hours' | 'within-day' | '1-2-days' | '3-plus-days';
export type FittingOption = 'virtual' | 'in-person' | 'send-garment' | 'standard-size';
export type PaymentMethod = 'bank-transfer' | 'card' | 'mobile-money' | 'platform-wallet';

export interface Skill {
  name: string;
  proficiency: ProficiencyLevel;
  yearsOfExperience?: number;
}

export interface Service {
  name: string;
  description: string;
  basePrice: number;
  timeRequired: string;
  isAvailable: boolean;
}

export interface PortfolioItem {
  title: string;
  description: string;
  images: string[]; // Array of image URLs or base64
  category: string;
  createdAt: Date;
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

export interface AwardType {
  name: string;
  year: number;
  organization: string;
}

export interface FeaturedInType {
  platform: string;
  url: string;
  description: string;
}

export interface BespokeFormData {
  // Step 1: Account
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  country: string;
  city: string;
  termsAccepted: boolean;
  
  // Step 2: Profile
  specialization: Specialization;
  businessName?: string;
  tagline?: string;
  bio?: string;
  experience: ExperienceLevel;
  yearsOfExperience: number;
  skills: Skill[];
  techniques: string[];
  materialsExpertise: string[];
  languages: string[];
  
  // Step 3: Services
  services: Service[];
  customizationOptions: {
    measurements: boolean;
    fabricSelection: boolean;
    designConsultation: boolean;
    multipleRevisions: boolean;
    rushOrders: boolean;
  };
  pricingModel: PricingModel;
  minimumOrderValue: number;
  depositPercentage: number;
  
  // Step 4: Business
  responseTime: ResponseTime;
  consultationHours: ConsultationHour[];
  workshopLocation: {
    city: string;
    country: string;
    acceptsLocalClients: boolean;
    acceptsInternationalClients: boolean;
  };
  shippingOptions: ShippingOption[];
  fittingOptions: FittingOption[];
  paymentMethods: PaymentMethod[];
  preferredCurrency: string;
  
  // Step 5: Portfolio
  portfolio: PortfolioItem[];
  
  // Step 6: Verification
  awards: AwardType[];
  featuredIn: FeaturedInType[];
}