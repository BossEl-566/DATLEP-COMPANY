import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProductAnalytics extends Document {
  product: Types.ObjectId;
  shop?: Types.ObjectId;

  views: number;
  addedToCart: number;
  removedFromCart: number;
  addedToWishlist: number;
  removedFromWishlist: number;
  purchases: number;

  lastViewedAt?: Date;

  actions: {
    action: string;
    timestamp: Date;
  }[];
}

const ProductActionSchema = new Schema(
  {
    action: {
      type: String,
      enum: [
        "product_view",
        "add_to_cart",
        "remove_from_cart",
        "add_to_wishlist",
        "remove_from_wishlist",
        "purchase",
      ],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const ProductAnalyticsSchema = new Schema<IProductAnalytics>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
      index: true,
    },

    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      index: true,
    },

    views: { type: Number, default: 0 },
    addedToCart: { type: Number, default: 0 },
    removedFromCart: { type: Number, default: 0 },
    addedToWishlist: { type: Number, default: 0 },
    removedFromWishlist: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },

    lastViewedAt: Date,

    actions: {
      type: [ProductActionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const ProductAnalytics = mongoose.model<IProductAnalytics>(
  "ProductAnalytics",
  ProductAnalyticsSchema
);
