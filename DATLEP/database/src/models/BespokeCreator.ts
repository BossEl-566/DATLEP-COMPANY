import { Schema, model, models, Document, Model } from 'mongoose';

export interface IBespokeCreator extends Document {
  // User account (linked to User model)
  user: Schema.Types.ObjectId;
  email: string;
  
  // Specialization
  specialization: 'tailor' | 'shoemaker' | 'leather-worker' | 'jewelry-maker' | 'embroidery-artist' | 'knitting-expert' | 'weaving-specialist' | 'dressmaker' | 'suits-specialist' | 'wedding-attire' | 'traditional-wear' | 'children-wear' | 'costume-designer';
  
  // Profile
  businessName?: string;
  tagline?: string;
  bio?: string;
  experience: 'beginner' | 'intermediate' | 'experienced' | 'expert' | 'master';
  yearsOfExperience: number;
  
  // Skills & Techniques
  skills: Array<{
    name: string;
    proficiency: 'basic' | 'intermediate' | 'advanced' | 'expert';
    yearsOfExperience?: number;
  }>;
  techniques: string[];
  materialsExpertise: string[];
  
  // Portfolio with Image references
  portfolio: Array<{
    title: string;
    description: string;
    images: Schema.Types.ObjectId[];
    category: string;
    createdAt: Date;
  }>;
  
  // Services Offered
  services: Array<{
    name: string;
    description: string;
    basePrice: number;
    timeRequired: string;
    isAvailable: boolean;
  }>;
  
  // Customization Options
  customizationOptions: {
    measurements: boolean;
    fabricSelection: boolean;
    designConsultation: boolean;
    multipleRevisions: boolean;
    rushOrders: boolean;
  };
  
  // Pricing
  pricingModel: 'hourly' | 'fixed' | 'project-based' | 'custom';
  minimumOrderValue: number;
  depositPercentage: number;
  
  // Communication & Availability
  responseTime: 'within-hours' | 'within-day' | '1-2-days' | '3-plus-days';
  consultationHours: Array<{
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>;
  languages: string[];
  
  // Location & Shipping
  workshopLocation: {
    city: string;
    country: string;
    acceptsLocalClients: boolean;
    acceptsInternationalClients: boolean;
  };
  shippingOptions: Array<{
    destination: string;
    cost: number;
    estimatedTime: string;
  }>;
  
  // Measurements & Fitting
  measurementGuide?: Schema.Types.ObjectId;
  fittingOptions: ('virtual' | 'in-person' | 'send-garment' | 'standard-size')[];
  
  // Ratings & Reviews
  averageRating: number;
  totalProjects: number;
  completedProjects: number;
  reviews: Schema.Types.ObjectId[];
  
  // Verification & Badges
  isVerified: boolean;
  verificationLevel: 'none' | 'basic' | 'premium' | 'partner';
  badges: Array<{
    badgeType: string;
    awardedAt: Date;
    expiresAt?: Date;
  }>;
  
  // Availability
  currentWorkload: number;
  maxProjectsPerMonth: number;
  isAcceptingNewProjects: boolean;
  vacationMode?: {
    isOnVacation: boolean;
    vacationStart?: Date;
    vacationEnd?: Date;
    vacationMessage?: string;
  };
  
  // Payment & Financial
  paymentMethods: ('bank-transfer' | 'card' | 'mobile-money' | 'platform-wallet')[];
  preferredCurrency: string;
  
  // Statistics
  successRate: number;
  averageCompletionTime?: number;
  repeatClientRate: number;
  
  // Social Proof
  featuredIn: Array<{
    platform: string;
    url: string;
    description: string;
  }>;
  awards: Array<{
    name: string;
    year: number;
    organization: string;
  }>;
  
  // Settings
  notificationPreferences: {
    newInquiry: boolean;
    projectUpdates: boolean;
    reviewReceived: boolean;
    paymentReceived: boolean;
  };
  
  // Status
  isActive: boolean;
  isFeatured: boolean;
  profileCompletion: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const BespokeCreatorSchema = new Schema<IBespokeCreator>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    
    specialization: {
      type: String,
      required: true,
      enum: ['tailor', 'shoemaker', 'leather-worker', 'jewelry-maker', 'embroidery-artist', 'knitting-expert', 'weaving-specialist', 'dressmaker', 'suits-specialist', 'wedding-attire', 'traditional-wear', 'children-wear', 'costume-designer']
    },
    
    businessName: { type: String, trim: true },
    tagline: { type: String, maxlength: 200, trim: true },
    bio: { type: String, maxlength: 1000, trim: true },
    experience: {
      type: String,
      enum: ['beginner', 'intermediate', 'experienced', 'expert', 'master'],
      default: 'beginner'
    },
    yearsOfExperience: { type: Number, min: 0, default: 0 },
    
    skills: [{
      name: { type: String },
      proficiency: { type: String, enum: ['basic', 'intermediate', 'advanced', 'expert'] },
      yearsOfExperience: { type: Number }
    }],
    techniques: [{ type: String }],
    materialsExpertise: [{ type: String }],
    
    portfolio: [{
      title: { type: String },
      description: { type: String },
      images: [{ type: Schema.Types.ObjectId, ref: 'Image' }], // Fixed: referencing Image model
      category: { type: String },
      createdAt: { type: Date, default: Date.now }
    }],
    
    services: [{
      name: { type: String },
      description: { type: String },
      basePrice: { type: Number },
      timeRequired: { type: String },
      isAvailable: { type: Boolean, default: true }
    }],
    
    customizationOptions: {
      measurements: { type: Boolean, default: true },
      fabricSelection: { type: Boolean, default: true },
      designConsultation: { type: Boolean, default: true },
      multipleRevisions: { type: Boolean, default: false },
      rushOrders: { type: Boolean, default: false }
    },
    
    pricingModel: {
      type: String,
      enum: ['hourly', 'fixed', 'project-based', 'custom'],
      default: 'fixed'
    },
    minimumOrderValue: { type: Number, default: 0 },
    depositPercentage: { type: Number, min: 0, max: 100, default: 50 },
    
    responseTime: {
      type: String,
      enum: ['within-hours', 'within-day', '1-2-days', '3-plus-days'],
      default: 'within-day'
    },
    consultationHours: [{
      day: { type: String },
      startTime: { type: String },
      endTime: { type: String },
      isAvailable: { type: Boolean, default: true }
    }],
    languages: [{ type: String }],
    
    workshopLocation: {
      city: { type: String },
      country: { type: String },
      acceptsLocalClients: { type: Boolean, default: true },
      acceptsInternationalClients: { type: Boolean, default: false }
    },
    shippingOptions: [{
      destination: { type: String },
      cost: { type: Number },
      estimatedTime: { type: String }
    }],
    
    measurementGuide: { type: Schema.Types.ObjectId, ref: 'Document' },
    fittingOptions: [{ type: String, enum: ['virtual', 'in-person', 'send-garment', 'standard-size'] }],
    
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalProjects: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'BespokeReview' }],
    
    isVerified: { type: Boolean, default: false },
    verificationLevel: {
      type: String,
      enum: ['none', 'basic', 'premium', 'partner'],
      default: 'none'
    },
    badges: [{
      badgeType: { type: String },
      awardedAt: { type: Date, default: Date.now },
      expiresAt: { type: Date }
    }],
    
    currentWorkload: { type: Number, min: 0, max: 100, default: 0 },
    maxProjectsPerMonth: { type: Number, default: 5 },
    isAcceptingNewProjects: { type: Boolean, default: true },
    vacationMode: {
      isOnVacation: { type: Boolean, default: false },
      vacationStart: { type: Date },
      vacationEnd: { type: Date },
      vacationMessage: { type: String }
    },
    
    paymentMethods: [{ type: String, enum: ['bank-transfer', 'card', 'mobile-money', 'platform-wallet'] }],
    preferredCurrency: { type: String, default: 'NGN' },
    
    successRate: { type: Number, min: 0, max: 100, default: 100 },
    averageCompletionTime: { type: Number },
    repeatClientRate: { type: Number, min: 0, max: 100, default: 0 },
    
    featuredIn: [{
      platform: { type: String },
      url: { type: String },
      description: { type: String }
    }],
    awards: [{
      name: { type: String },
      year: { type: Number },
      organization: { type: String }
    }],
    
    notificationPreferences: {
      newInquiry: { type: Boolean, default: true },
      projectUpdates: { type: Boolean, default: true },
      reviewReceived: { type: Boolean, default: true },
      paymentReceived: { type: Boolean, default: true }
    },
    
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    profileCompletion: { type: Number, min: 0, max: 100, default: 0 }
  },
  { timestamps: true }
);

BespokeCreatorSchema.index({ user: 1 }, { unique: true });
BespokeCreatorSchema.index({ specialization: 1 });
BespokeCreatorSchema.index({ 'workshopLocation.city': 1, 'workshopLocation.country': 1 });
BespokeCreatorSchema.index({ averageRating: -1 });
BespokeCreatorSchema.index({ isVerified: 1 });
BespokeCreatorSchema.index({ isAcceptingNewProjects: 1 });
BespokeCreatorSchema.index({ profileCompletion: -1 });

export const BespokeCreator: Model<IBespokeCreator> = models.BespokeCreator || model<IBespokeCreator>('BespokeCreator', BespokeCreatorSchema);