import {
  Schema,
  model,
  models,
  Model,
  Types,
  HydratedDocument
} from 'mongoose';


export interface IProductSpecification {
  [key: string]: string | number | boolean;
}

export interface IProductProperty {
  key: string;
  value: string | number | boolean;
  label?: string;
}

export interface IDiscountCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  maxUses?: number;
  usedCount: number;
  startDate: Date;
  endDate: Date;
  minPurchaseAmount?: number;
  isActive: boolean;
}

export interface IColorVariant {
  name: string;
  hexCode: string;
  image?: Types.ObjectId;
  available: boolean;
}

export interface ISizeVariant {
  size: string;
  description?: string;
  available: boolean;
  stock: number;
}

export interface IProduct {
  title: string;
  slug: string;
  category: string;
  subcategory?: string;
  shortDescription: string;
  detailedDescription: string;

  image: Types.ObjectId;
  youtubeVideoUrl?: string;
  gallery?: Types.ObjectId[];

  tags: string[];
  brand?: string;
  colors: IColorVariant[];
  sizes: ISizeVariant[];

  startingDate?: Date;
  endingDate?: Date;
  stock: number;
  salePrice?: number;
  regularPrice: number;

  ratings: {
    average: number;
    count: number;
    distribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };

  warranty?: {
    duration: string;
    type: string;
    details?: string;
  };

  customSpecification: IProductSpecification;
  customProperties: IProductProperty[];

  isDeleted: boolean;
  cashOnDelivery: boolean;
  discountCodes: IDiscountCode[];

  status: 'active' | 'pending' | 'draft';
  deletedAt?: Date;

  shopId: Types.ObjectId;
  sellerId: Types.ObjectId;

  featured: boolean;
  featuredUntil?: Date;
  views: number;
  favoritesCount: number;
  orderCount: number;

  sku?: string;
  barcode?: string;
  weight?: number;

  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'inch' | 'm';
  };

  shipping?: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
      unit: 'cm' | 'inch' | 'm';
    };
    requiresShipping: boolean;
    shippingClass?: string;
  };

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}


export type ProductDocument = HydratedDocument<IProduct>;

export interface ProductMethods {
  updateRating(rating: number): Promise<ProductDocument>;
  applyDiscountCode(
    code: string,
    cartTotal: number
  ): IDiscountCode | undefined;
  decreaseStock(
    quantity: number,
    size?: string
  ): Promise<ProductDocument>;
  increaseStock(
    quantity: number,
    size?: string
  ): Promise<ProductDocument>;
}

export interface ProductModel
  extends Model<IProduct, {}, ProductMethods> {
  findActiveByShop(shopId: Types.ObjectId): Promise<ProductDocument[]>;
  findActiveBySeller(sellerId: Types.ObjectId): Promise<ProductDocument[]>;
  findFeatured(): Promise<ProductDocument[]>;
  findByCategory(
    category: string,
    sellerId?: Types.ObjectId
  ): Promise<ProductDocument[]>;
}


const ColorVariantSchema = new Schema<IColorVariant>({
  name: { type: String, required: true },
  hexCode: { type: String, required: true },
  image: { type: Schema.Types.ObjectId, ref: 'Image' },
  available: { type: Boolean, default: true }
});

const SizeVariantSchema = new Schema<ISizeVariant>({
  size: { type: String, required: true },
  description: String,
  available: { type: Boolean, default: true },
  stock: { type: Number, default: 0, min: 0 }
});

const DiscountCodeSchema = new Schema<IDiscountCode>({
  code: { type: String, required: true, uppercase: true },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: { type: Number, required: true, min: 0 },
  maxUses: { type: Number, min: 1 },
  usedCount: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  minPurchaseAmount: { type: Number, min: 0 },
  isActive: { type: Boolean, default: true }
});

const RatingsSchema = new Schema({
  average: { type: Number, default: 0, min: 0, max: 5 },
  count: { type: Number, default: 0 },
  distribution: {
    1: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    5: { type: Number, default: 0 }
  }
});


const ProductSchema = new Schema<IProduct, ProductModel, ProductMethods>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    subcategory: String,

    shortDescription: { type: String, required: true },
    detailedDescription: { type: String, required: true },

    image: { type: Schema.Types.ObjectId, ref: 'Image', required: true },
    youtubeVideoUrl: String,
    gallery: [{ type: Schema.Types.ObjectId, ref: 'Image' }],

    tags: [String],
    brand: String,
    colors: [ColorVariantSchema],
    sizes: [SizeVariantSchema],

    stock: { type: Number, default: 0, min: 0 },
    salePrice: {
      type: Number,
      validate: {
        validator(this: ProductDocument, value: number) {
          return value == null || value <= this.regularPrice;
        }
      }
    },
    regularPrice: { type: Number, required: true },

    ratings: { type: RatingsSchema, default: () => ({}) },

    customSpecification: { type: Schema.Types.Mixed, default: {} },
    customProperties: [],

    isDeleted: { type: Boolean, default: false },
    cashOnDelivery: { type: Boolean, default: true },
    discountCodes: [DiscountCodeSchema],

    status: {
      type: String,
      enum: ['active', 'pending', 'draft'],
      default: 'active'
    },
    deletedAt: Date,

    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },

    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);


ProductSchema.virtual('totalStock').get(function (this: ProductDocument) {
  return this.sizes.length
    ? this.sizes.reduce((t: number, s) => t + s.stock, 0)
    : this.stock;
});



ProductSchema.methods.updateRating = function (
  this: ProductDocument,
  rating: number
) {
  this.ratings.count += 1;
  this.ratings.average =
    ((this.ratings.average * (this.ratings.count - 1)) + rating) /
    this.ratings.count;

  const r = Math.round(rating);
  if (r >= 1 && r <= 5) {
    this.ratings.distribution[r as 1 | 2 | 3 | 4 | 5] += 1;
  }

  return this.save();
};

ProductSchema.methods.decreaseStock = function (
  this: ProductDocument,
  quantity: number,
  size?: string
) {
  if (size) {
    const variant = this.sizes.find(s => s.size === size);
    if (!variant || variant.stock < quantity) {
      throw new Error('Insufficient stock');
    }
    variant.stock -= quantity;
  } else {
    if (this.stock < quantity) throw new Error('Insufficient stock');
    this.stock -= quantity;
  }

  return this.save();
};

ProductSchema.methods.increaseStock = function (
  this: ProductDocument,
  quantity: number,
  size?: string
) {
  if (size) {
    const variant = this.sizes.find(s => s.size === size);
    if (variant) variant.stock += quantity;
  } else {
    this.stock += quantity;
  }

  return this.save();
};


ProductSchema.statics.findActiveByShop = function (
  shopId: Types.ObjectId
) {
  return this.find({ shopId, status: 'active', isDeleted: false });
};



export const Product =
  (models.Product as ProductModel) ||
  model<IProduct, ProductModel>('Product', ProductSchema);
