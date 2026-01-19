import { Schema, model, models, Document, Model } from 'mongoose';

export interface ISeller extends Document {
  // Basic Information
  name: string;
  email: string;
  phoneNumber: string;
  password: string;

  // Location Information
  country: string;
  region?: string;
  state?: string;
  city?: string;

  // Business Information (NO ENUMS)
  sellerType: string;
  businessRegistration?: string;
  yearsInBusiness: string;
  specialties: string[];

  // Verification & Status
  isVerified: boolean;
  verificationStatus: string;
  verificationDocuments?: Array<{
    documentType: string;
    documentUrl: string;
    uploadedAt: Date;
    status: string;
  }>;

  // Payment Integration
  bankType: string | null;
  stripeAccountId?: string;
  paystackCustomerCode?: string;
  flutterwaveMerchantId?: string;
  paymentDetails?: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    bankCode?: string;
    currency?: string;
  };
  isPaymentSetup: boolean;

  // Shop Reference
  shop?: Schema.Types.ObjectId;

  // Profile
  avatar?: Schema.Types.ObjectId;
  bio?: string;
  portfolioLink?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    whatsapp?: string;
    tiktok?: string;
  };

  // Statistics
  totalSales: number;
  totalEarnings: number;
  averageRating: number;

  // Settings
  notificationPreferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    orderUpdates: boolean;
    marketingEmails: boolean;
  };

  // Security
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: Date;

  // Status
  isActive: boolean;
  deactivationReason?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const SellerSchema = new Schema<ISeller>(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phoneNumber: { type: String, required: true, trim: true },

    password: { type: String, required: true, minlength: 6 },

    country: { type: String, required: true, trim: true },
    region: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true },

    // NO ENUMS — normalized string
    sellerType: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      default: 'fashion-seller'
    },

    businessRegistration: { type: String, trim: true },

    yearsInBusiness: {
      type: String,
      trim: true,
      default: '<1'
    },

    specialties: { type: [String], default: [] },

    isVerified: { type: Boolean, default: false },

    verificationStatus: {
      type: String,
      default: 'pending'
    },

    verificationDocuments: [
      {
        documentType: String,
        documentUrl: String,
        uploadedAt: Date,
        status: { type: String, default: 'pending' }
      }
    ],

    bankType: { type: String, default: null },

    stripeAccountId: { type: String, trim: true },
    paystackCustomerCode: { type: String, trim: true },
    flutterwaveMerchantId: { type: String, trim: true },

    paymentDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
      bankCode: String,
      currency: { type: String, default: 'NGN' }
    },

    isPaymentSetup: { type: Boolean, default: false },

    shop: { type: Schema.Types.ObjectId, ref: 'Shop' },

    avatar: { type: Schema.Types.ObjectId, ref: 'Image' },

    bio: { type: String, maxlength: 500 },

    portfolioLink: { type: String, trim: true },

    socialLinks: {
      instagram: String,
      facebook: String,
      twitter: String,
      whatsapp: String,
      tiktok: String
    },

    totalSales: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },

    notificationPreferences: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: true },
      orderUpdates: { type: Boolean, default: true },
      marketingEmails: { type: Boolean, default: false }
    },

    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },

    lastLogin: { type: Date },

    isActive: { type: Boolean, default: true },

    deactivationReason: { type: String, trim: true }
  },
  { timestamps: true }
);

// Indexes
SellerSchema.index({ sellerType: 1 });
SellerSchema.index({ country: 1, city: 1 });
SellerSchema.index({ isVerified: 1 });
SellerSchema.index({ verificationStatus: 1 });

export const Seller: Model<ISeller> =
  models.Seller || model<ISeller>('Seller', SellerSchema);
