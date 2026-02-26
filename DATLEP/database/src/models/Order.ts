import { Schema, model, models, Model, Types } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'ready'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'unpaid'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partial_refund';

export interface IOrderItemSnapshot {
  productId: Types.ObjectId; // ref Product

  quantity: number;

  // variant snapshot (matches your Product sizes/colors)
  selectedSize?: string;
  selectedColor?: {
    name: string;
    hexCode?: string;
  };

  // item snapshots (immutable)
  titleSnapshot: string;
  skuSnapshot?: string;
  imageSnapshot?: Types.ObjectId; // ref Image (or change to string URL if you prefer)
  unitPriceSnapshot: number;
  lineTotal: number; // unitPriceSnapshot * quantity
}

export interface IAddressSnapshot {
  recipientName: string;
  phone: string;

  country: string;
  state?: string;
  city: string;
  area?: string;

  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;
}

export interface IOrder {
  orderNumber: string;

  customerId: Types.ObjectId; // ref User/Client
  sellerId: Types.ObjectId;   // ref Seller
  shopId: Types.ObjectId;     // ref Shop

  status: OrderStatus;
  paymentStatus: PaymentStatus;

  currency: string;

  items: IOrderItemSnapshot[];

  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  taxTotal: number;
  total: number;

  // keep refs (optional) + always keep snapshot
  shippingAddressId?: Types.ObjectId; // ref Address
  billingAddressId?: Types.ObjectId;  // ref Address
  shippingAddressSnapshot: IAddressSnapshot;
  billingAddressSnapshot?: IAddressSnapshot;

  delivery: {
    method: 'standard' | 'express' | 'pickup';
    notes?: string;
    trackingNumber?: string;
    carrier?: string;
    estimatedDeliveryDate?: Date;
  };

  payment?: {
    provider?: 'paystack' | 'flutterwave' | 'stripe' | 'momo' | string;
    reference?: string;
    paidAt?: Date;
    amountPaid?: number;
  };

  customerNote?: string;
  adminNote?: string;

  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItemSnapshot>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },

    quantity: { type: Number, required: true, min: 1 },

    selectedSize: { type: String },
    selectedColor: {
      name: { type: String },
      hexCode: { type: String }
    },

    titleSnapshot: { type: String, required: true, trim: true },
    skuSnapshot: { type: String, trim: true },
    imageSnapshot: { type: Schema.Types.ObjectId, ref: 'Image' },

    unitPriceSnapshot: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const AddressSnapshotSchema = new Schema<IAddressSnapshot>(
  {
    recipientName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },

    country: { type: String, required: true, default: 'Ghana' },
    state: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    area: { type: String, trim: true },

    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true },
    postalCode: { type: String, trim: true }
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },

    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true, index: true },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'ready', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
      index: true
    },

    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'failed', 'refunded', 'partial_refund'],
      default: 'unpaid',
      index: true
    },

    currency: { type: String, default: 'GHS' },

    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (v: any[]) => Array.isArray(v) && v.length > 0,
        message: 'Order must contain at least one item'
      }
    },

    subtotal: { type: Number, required: true, min: 0 },
    discountTotal: { type: Number, default: 0, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    taxTotal: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },

    shippingAddressId: { type: Schema.Types.ObjectId, ref: 'Address' },
    billingAddressId: { type: Schema.Types.ObjectId, ref: 'Address' },

    shippingAddressSnapshot: { type: AddressSnapshotSchema, required: true },
    billingAddressSnapshot: { type: AddressSnapshotSchema },

    delivery: {
      method: { type: String, enum: ['standard', 'express', 'pickup'], default: 'standard' },
      notes: { type: String, trim: true },
      trackingNumber: { type: String, trim: true },
      carrier: { type: String, trim: true },
      estimatedDeliveryDate: { type: Date }
    },

    payment: {
      provider: { type: String, trim: true },
      reference: { type: String, trim: true },
      paidAt: { type: Date },
      amountPaid: { type: Number, min: 0 }
    },

    customerNote: { type: String, trim: true, maxlength: 500 },
    adminNote: { type: String, trim: true, maxlength: 500 }
  },
  { timestamps: true }
);

/* Indexes */
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ customerId: 1, createdAt: -1 });
OrderSchema.index({ sellerId: 1, createdAt: -1 });
OrderSchema.index({ shopId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

export const Order: Model<IOrder> =
  models.Order || model<IOrder>('Order', OrderSchema);