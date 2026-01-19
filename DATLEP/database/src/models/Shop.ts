import { Schema, model, models, Model } from 'mongoose';

export interface IOpeningHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isOpen: boolean;
  openingTime?: string;
  closingTime?: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface ISocialLinks {
  platform:
    | 'instagram'
    | 'facebook'
    | 'twitter'
    | 'whatsapp'
    | 'tiktok'
    | 'youtube'
    | 'linkedin'
    | 'pinterest';
  url: string;
  handle?: string;
}

export interface IShop {
  name: string;
  slug?: string;
  bio: string;

  // Updated fashion categories
  category:
    | 'tailoring'
    | 'shoemaking'
    | 'fashion-retail'
    | 'thrift-store'
    | 'repair-service'
    | 'fabric-store'
    | 'accessories'
    | 'ready-to-wear'
    | 'custom-clothing'
    | 'traditional-wear'
    | 'wedding-attire'
    | 'children-fashion'
    | 'mens-fashion'
    | 'womens-fashion'
    | 'unisex-fashion'
    | 'footwear'
    | 'leather-goods'
    | 'jewelry'
    | 'bags-purses'
    | 'belts'
    | 'hats'
    | 'scarves'
    | 'gloves'
    | 'ties'
    | 'socks'
    | 'lingerie'
    | 'swimwear'
    | 'sportswear'
    | 'evening-wear'
    | 'business-wear'
    | 'casual-wear'
    | 'streetwear'
    | 'vintage'
    | 'eco-fashion'
    | 'plus-size'
    | 'maternity-wear'
    | 'bridal'
    | 'formal-wear'
    | 'costumes'
    | 'uniforms'
    | 'workwear'
    | 'protective-clothing'
    | 'fashion-materials'
    | 'buttons'
    | 'zippers'
    | 'threads'
    | 'embroidery'
    | 'beads'
    | 'sequins'
    | 'lace'
    | 'ribbons'
    | 'patches';

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
    postalCode?: string;
    coordinates?: {
      type: 'Point';
      coordinates: [number, number];
    };
  };

  contactEmail?: string;
  contactPhone?: string;

  openingHours: IOpeningHours[];
  timezone: string;

  website?: string;
  socialLinks?: ISocialLinks[];

  seller: Schema.Types.ObjectId;

  // Business details
  businessRegistration?: string;
  yearsInBusiness?: string;
  specialties?: string[];
  portfolioLink?: string;

  // Products & Services
  products: Schema.Types.ObjectId[];
  services?: Array<{
    name: string;
    description: string;
    price: number;
    duration: string;
    isAvailable: boolean;
  }>;

  // Policies
  returnPolicy?: string;
  shippingPolicy?: string;
  customOrderPolicy?: string;
  privacyPolicy?: string;

  rating: number;
  totalReviews: number;
  reviews?: Schema.Types.ObjectId[];

  totalOrders: number;
  completedOrders: number;
  cancellationRate: number;
  responseTime: number;

  isFeatured: boolean;
  isVerifiedShop: boolean;
  verificationBadges?: Array<{
    badgeType: 'top-rated' | 'fast-shipper' | 'custom-expert' | 'quality-guaranteed' | 'eco-friendly';
    awardedAt: Date;
    expiresAt?: Date;
  }>;

  orderAcceptance: {
    autoAccept: boolean;
    maxOrdersPerDay: number;
  };

  notificationSettings: {
    newOrder: boolean;
    reviewReceived: boolean;
    messageReceived: boolean;
  };

  isActive: boolean;
  isOpen: boolean;

  vacationMode?: {
    isOnVacation: boolean;
    vacationStart?: Date;
    vacationEnd?: Date;
    vacationMessage?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const OpeningHoursSchema = new Schema<IOpeningHours>({
  day: {
    type: String,
    required: true,
    enum: [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday'
    ]
  },
  isOpen: { type: Boolean, default: true },
  openingTime: String,
  closingTime: String,
  breakStart: String,
  breakEnd: String
});

const SocialLinksSchema = new Schema<ISocialLinks>({
  platform: {
    type: String,
    required: true,
    enum: [
      'instagram',
      'facebook',
      'twitter',
      'whatsapp',
      'tiktok',
      'youtube',
      'linkedin',
      'pinterest'
    ]
  },
  url: { type: String, required: true },
  handle: String
});

const ShopSchema = new Schema<IShop>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },

    slug: { type: String, unique: true, lowercase: true, trim: true },

    bio: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true
    },

    category: {
      type: String,
      required: true,
      enum: [
        'tailoring',
        'shoemaking',
        'fashion-retail',
        'thrift-store',
        'repair-service',
        'fabric-store',
        'accessories',
        'ready-to-wear',
        'custom-clothing',
        'traditional-wear',
        'wedding-attire',
        'children-fashion',
        'mens-fashion',
        'womens-fashion',
        'unisex-fashion',
        'footwear',
        'leather-goods',
        'jewelry',
        'bags-purses',
        'belts',
        'hats',
        'scarves',
        'gloves',
        'ties',
        'socks',
        'lingerie',
        'swimwear',
        'sportswear',
        'evening-wear',
        'business-wear',
        'casual-wear',
        'streetwear',
        'vintage',
        'eco-fashion',
        'plus-size',
        'maternity-wear',
        'bridal',
        'formal-wear',
        'costumes',
        'uniforms',
        'workwear',
        'protective-clothing',
        'fashion-materials',
        'buttons',
        'zippers',
        'threads',
        'embroidery',
        'beads',
        'sequins',
        'lace',
        'ribbons',
        'patches'
      ]
    },

    shopType: {
      type: String,
      enum: ['physical', 'online', 'both'],
      default: 'both'
    },

    avatar: { type: Schema.Types.ObjectId, ref: 'Image' },
    coverBanner: { type: Schema.Types.ObjectId, ref: 'Image' },
    logo: { type: Schema.Types.ObjectId, ref: 'Image' },
    gallery: [{ type: Schema.Types.ObjectId, ref: 'Image' }],

    address: {
      street: String,
      city: { type: String, required: true },
      state: String,
      country: { type: String, required: true },
      postalCode: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number],
          default: [0, 0]
        }
      }
    },

    contactEmail: { type: String, lowercase: true, trim: true },
    contactPhone: { type: String, trim: true },

    // Business details
    businessRegistration: { type: String, trim: true },
    yearsInBusiness: {
      type: String,
      enum: ['<1', '1-3', '3-5', '5-10', '10+'],
      default: '<1'
    },
    specialties: [{ type: String }],
    portfolioLink: { type: String, trim: true },

    openingHours: {
      type: [OpeningHoursSchema],
      required: true,
      validate: {
        validator: function (value: IOpeningHours[]) {
          return Array.isArray(value) && value.length > 0;
        },
        message: 'Opening hours must contain at least one day'
      }
    },

    timezone: { type: String, default: 'Africa/Lagos' },

    website: { type: String, trim: true },
    socialLinks: [SocialLinksSchema],

    seller: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },

    // Products & Services
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    services: [{
      name: String,
      description: String,
      price: Number,
      duration: String,
      isAvailable: { type: Boolean, default: true }
    }],

    // Policies
    returnPolicy: { type: String, maxlength: 500 },
    shippingPolicy: { type: String, maxlength: 500 },
    customOrderPolicy: { type: String, maxlength: 500 },
    privacyPolicy: { type: String, maxlength: 500 },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'ShopReview' }],

    totalOrders: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    cancellationRate: { type: Number, default: 0, min: 0, max: 100 },
    responseTime: { type: Number, default: 24 },

    isFeatured: { type: Boolean, default: false },
    isVerifiedShop: { type: Boolean, default: false },
    verificationBadges: [{
      badgeType: { type: String, enum: ['top-rated', 'fast-shipper', 'custom-expert', 'quality-guaranteed', 'eco-friendly'] },
      awardedAt: { type: Date },
      expiresAt: { type: Date }
    }],

    orderAcceptance: {
      autoAccept: { type: Boolean, default: false },
      maxOrdersPerDay: { type: Number, default: 10 }
    },

    notificationSettings: {
      newOrder: { type: Boolean, default: true },
      reviewReceived: { type: Boolean, default: true },
      messageReceived: { type: Boolean, default: true }
    },

    isActive: { type: Boolean, default: true },
    isOpen: { type: Boolean, default: true },

    vacationMode: {
      isOnVacation: { type: Boolean, default: false },
      vacationStart: Date,
      vacationEnd: Date,
      vacationMessage: String
    }
  },
  { timestamps: true }
);

/* =======================
   INDEXES
======================= */

// ShopSchema.index({ slug: 1 }, { unique: true });
ShopSchema.index({ seller: 1 });
ShopSchema.index({ category: 1 });
ShopSchema.index({ rating: -1 });
ShopSchema.index({ 'address.city': 1, 'address.country': 1 });
ShopSchema.index({ 'address.coordinates': '2dsphere' });
ShopSchema.index({ isVerifiedShop: 1 });
ShopSchema.index({ isFeatured: 1 });
ShopSchema.index({ isActive: 1 });

export const Shop: Model<IShop> =
  models.Shop || model<IShop>('Shop', ShopSchema);