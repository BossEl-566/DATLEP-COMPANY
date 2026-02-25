import { Schema, model, models, Document, Types } from 'mongoose';

export interface IAddress extends Document {
  user: Types.ObjectId;

  label: 'home' | 'work' | 'office' | 'other';

  recipientName: string;
  phone: string;

  country: string;
  state?: string;
  city: string;
  area?: string;

  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;

  addressType: 'shipping' | 'billing';

  isDefault: boolean;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    label: {
      type: String,
      enum: ['home', 'work', 'office', 'other'],
      default: 'home',
    },

    recipientName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
      default: 'Ghana',
    },

    state: {
      type: String,
    },

    city: {
      type: String,
      required: true,
    },

    area: {
      type: String,
    },

    addressLine1: {
      type: String,
      required: true,
    },

    addressLine2: {
      type: String,
    },

    postalCode: {
      type: String,
    },

    addressType: {
      type: String,
      enum: ['shipping', 'billing'],
      default: 'shipping',
    },

    isDefault: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Address =
  models.Address || model<IAddress>('Address', AddressSchema);