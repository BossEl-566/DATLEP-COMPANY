import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUserAnalytics extends Document {
  user: Types.ObjectId;

  sessions: {
    sessionId: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    deviceType: "mobile" | "desktop" | "tablet";
    browser: string;
    browserVersion: string;
    os: string;
    osVersion: string;
    screenResolution: string;
    language: string;
    timezone: string;
    ipAddress?: string;
    userAgent: string;
  }[];

  actions: {
    productId: Types.ObjectId;
    shopId?: Types.ObjectId;
    action:
      | "product_view"
      | "add_to_cart"
      | "remove_from_cart"
      | "add_to_wishlist"
      | "remove_from_wishlist";
    timestamp: Date;
  }[];

  engagement: {
    totalSessions: number;
    lastActive?: Date;
    avgSessionDuration?: number;
  };

  segmentation: {
    devicePreference?: "mobile" | "desktop" | "tablet";
  };

  lastVisitedAt?: Date;
  country?: string;
  city?: string;
  device?: string;
}

const SessionSchema = new Schema(
  {
    sessionId: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: Date,
    duration: Number,
    deviceType: {
      type: String,
      enum: ["mobile", "desktop", "tablet"],
      required: true,
    },
    browser: String,
    browserVersion: String,
    os: String,
    osVersion: String,
    screenResolution: String,
    language: String,
    timezone: String,
    ipAddress: String,
    userAgent: String,
  },
  { _id: false }
);

const ActionSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    action: {
      type: String,
      enum: [
        "product_view",
        "add_to_cart",
        "remove_from_cart",
        "add_to_wishlist",
        "remove_from_wishlist",
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

const UserAnalyticsSchema = new Schema<IUserAnalytics>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    sessions: {
      type: [SessionSchema],
      default: [],
    },

    actions: {
      type: [ActionSchema],
      default: [],
    },

    engagement: {
      totalSessions: {
        type: Number,
        default: 0,
      },
      lastActive: Date,
      avgSessionDuration: Number,
    },

    segmentation: {
      devicePreference: {
        type: String,
        enum: ["mobile", "desktop", "tablet"],
      },
    },

    lastVisitedAt: Date,
    country: String,
    city: String,
    device: String,
  },
  { timestamps: true }
);

export const UserAnalytics = mongoose.model<IUserAnalytics>(
  "UserAnalytics",
  UserAnalyticsSchema
);
