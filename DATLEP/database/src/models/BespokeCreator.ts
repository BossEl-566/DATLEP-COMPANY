import { Schema, model, models, Document, Model } from 'mongoose';

export interface IBespokeCreator extends Document {
  // Basic Auth
  name: string;
  email: string;
  phoneNumber?: string;
  password: string;

  // Location
  country: string;
  city?: string;

  // Craft / Identity
  creatorType: string; // tailor, shoemaker, etc (free text)
  specialties: string[];

  // Verification & Security
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: Date;

  // Account Status
  isVerified: boolean;
  verificationStatus: string; // pending, approved, rejected
  isActive: boolean;
  deactivationReason?: string;

  // Profile
  avatar?: Schema.Types.ObjectId;
  bio?: string;

  // Settings
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    marketing: boolean;
  };

  // References
  shop?: Schema.Types.ObjectId;

  // Analytics
  totalClients: number;
  repeatClientRate: number; // percentage 0-100
  averageRating: number; // 0-5

  createdAt: Date;
  updatedAt: Date;
}

const BespokeCreatorSchema = new Schema<IBespokeCreator>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^\S+@\S+\.\S+$/ },
  phoneNumber: { type: String, trim: true },
  password: { type: String, required: true },

  country: { type: String, required: true },
  city: { type: String },

  creatorType: { type: String, required: true },
  specialties: [{ type: String, default: [] }],

  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  lastLogin: { type: Date },

  isVerified: { type: Boolean, default: false },
  verificationStatus: { type: String, default: 'pending' },
  isActive: { type: Boolean, default: true },
  deactivationReason: { type: String },

  avatar: { type: Schema.Types.ObjectId, ref: 'Image' },
  bio: { type: String, maxlength: 1000 },

  notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false }
  },

  shop: { type: Schema.Types.ObjectId, ref: 'BespokeShop' },

  totalClients: { type: Number, default: 0 },
  repeatClientRate: { type: Number, default: 0, min: 0, max: 100 },
  averageRating: { type: Number, default: 0, min: 0, max: 5 }
}, { timestamps: true });

export const BespokeCreator: Model<IBespokeCreator> =
  models.BespokeCreator || model<IBespokeCreator>('BespokeCreator', BespokeCreatorSchema);
