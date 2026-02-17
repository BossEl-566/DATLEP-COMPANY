import { Schema, model, models, Document, Model } from 'mongoose';

export interface IDiscount extends Document {
  public_name: string;
  discountType: string;
  discountValue: number;
  discountCode: string;
  sellerId: Schema.Types.ObjectId | string; // <-- allow string for queries
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DiscountSchema = new Schema<IDiscount>(
  {
    public_name: {
      type: String,
      required: true,
      trim: true
    },

    discountType: {
      type: String,
      required: true,
      trim: true,
      lowercase: true // e.g. percentage | fixed
    },

    discountValue: {
      type: Number,
      required: true
    },

    discountCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'Seller',
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    expiresAt: {
      type: Date
    }
  },
  { timestamps: true }
);

// Indexes
DiscountSchema.index({ sellerId: 1 });
DiscountSchema.index({ isActive: 1 });

export const Discount: Model<IDiscount> =
  models.Discount || model<IDiscount>('Discount', DiscountSchema);
