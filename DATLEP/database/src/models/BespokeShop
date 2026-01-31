import { Schema, model, models, Document, Model } from 'mongoose';
import { IBespokeCreator } from './BespokeCreator';

export interface IBespokeShop extends Document {
  name: string;
  slug: string;
  bio: string;

  category: string;
  shopType: 'physical' | 'online' | 'both';

  avatar?: Schema.Types.ObjectId;
  coverBanner?: Schema.Types.ObjectId;
  logo?: Schema.Types.ObjectId;
  gallery?: Schema.Types.ObjectId[];

  address: {
    street?: string;
    city: string;
    state?: string;
    country: string;
    coordinates?: {
      type: 'Point';
      coordinates: [number, number];
    };
  };

  contactEmail?: string;
  contactPhone?: string;

  openingHours: {
    day: string;
    isOpen: boolean;
    openingTime?: string;
    closingTime?: string;
  }[];
  timezone: string;

  website?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];

  creator: Schema.Types.ObjectId | IBespokeCreator;

  services?: {
    name: string;
    description: string;
    price: number;
    duration: string;
    isAvailable: boolean;
  }[];

  policies?: {
    customOrder?: string;
    returns?: string;
    privacy?: string;
  };

  rating: number;
  totalReviews: number;

  isFeatured: boolean;
  isVerifiedShop: boolean;

  isActive: boolean;
  isOpen: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const BespokeShopSchema = new Schema<IBespokeShop>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },

    bio: { type: String, required: true, maxlength: 1000 },

    category: { type: String, required: true, trim: true },
    shopType: { type: String, enum: ['physical', 'online', 'both'], default: 'both' },

    avatar: { type: Schema.Types.ObjectId, ref: 'Image' },
    coverBanner: { type: Schema.Types.ObjectId, ref: 'Image' },
    logo: { type: Schema.Types.ObjectId, ref: 'Image' },
    gallery: [{ type: Schema.Types.ObjectId, ref: 'Image' }],

    address: {
      street: String,
      city: { type: String, required: true },
      state: String,
      country: { type: String, required: true },
      coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
      }
    },

    contactEmail: { type: String, lowercase: true, trim: true },
    contactPhone: { type: String, trim: true },

    openingHours: [
      {
        day: { type: String, required: true },
        isOpen: { type: Boolean, default: true },
        openingTime: String,
        closingTime: String
      }
    ],
    timezone: { type: String, default: 'Africa/Lagos' },

    website: { type: String, trim: true },
    socialLinks: [
      {
        platform: String,
        url: String
      }
    ],

    creator: { type: Schema.Types.ObjectId, ref: 'BespokeCreator', required: true },

    services: [
      {
        name: { type: String, required: true },
        description: String,
        price: { type: Number, required: true },
        duration: String,
        isAvailable: { type: Boolean, default: true }
      }
    ],

    policies: {
      customOrder: String,
      returns: String,
      privacy: String
    },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },

    isFeatured: { type: Boolean, default: false },
    isVerifiedShop: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },
    isOpen: { type: Boolean, default: true }
  },
  { timestamps: true }
);

/* ===================== INDEXES ==================== */
BespokeShopSchema.index({ creator: 1 });
BespokeShopSchema.index({ category: 1 });
BespokeShopSchema.index({ rating: -1 });
BespokeShopSchema.index({ 'address.city': 1, 'address.country': 1 });
BespokeShopSchema.index({ 'address.coordinates': '2dsphere' });

export const BespokeShop: Model<IBespokeShop> =
  models.BespokeShop || model<IBespokeShop>('BespokeShop', BespokeShopSchema);
