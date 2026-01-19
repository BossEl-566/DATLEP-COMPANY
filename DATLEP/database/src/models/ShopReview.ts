import { Schema, model, models, Document, Model } from 'mongoose';

export interface IShopReview extends Document {
  // User who wrote the review
  user: Schema.Types.ObjectId;
  
  // Shop being reviewed
  shop: Schema.Types.ObjectId;
  
  // Order reference (optional)
  order?: Schema.Types.ObjectId;
  
  // Review content
  rating: number;
  title?: string;
  comment: string;
  
  // Review categories (for detailed feedback)
  quality?: number;
  craftsmanship?: number;
  communication?: number;
  shipping?: number;
  valueForMoney?: number;
  
  // Media with Image reference
  images: Schema.Types.ObjectId[];
  
  // Helpfulness
  helpfulCount: number;
  unhelpfulCount: number;
  reportedCount: number;
  
  // Seller response
  sellerResponse?: {
    response: string;
    respondedAt: Date;
  };
  
  // Verification
  isVerifiedPurchase: boolean;
  verificationMethod?: 'order' | 'admin' | null;
  
  // Moderation
  isApproved: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderationNotes?: string;
  
  // Metadata
  helpfulVotes: Array<{
    user: Schema.Types.ObjectId;
    isHelpful: boolean;
    votedAt: Date;
  }>;
  
  // Flags
  isEdited: boolean;
  editHistory?: Array<{
    comment: string;
    editedAt: Date;
  }>;
  
  // Status
  isActive: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ShopReviewSchema = new Schema<IShopReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, maxlength: 100, trim: true },
    comment: { type: String, required: true, maxlength: 1000, trim: true },
    
    quality: { type: Number, min: 1, max: 5 },
    craftsmanship: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    shipping: { type: Number, min: 1, max: 5 },
    valueForMoney: { type: Number, min: 1, max: 5 },
    
    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }], // Fixed: referencing Image model
    
    helpfulCount: { type: Number, default: 0 },
    unhelpfulCount: { type: Number, default: 0 },
    reportedCount: { type: Number, default: 0 },
    
    sellerResponse: {
      response: { type: String, maxlength: 1000 },
      respondedAt: { type: Date }
    },
    
    isVerifiedPurchase: { type: Boolean, default: false },
    verificationMethod: { type: String, enum: ['order', 'admin', null] },
    
    isApproved: { type: Boolean, default: true },
    moderationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'flagged'],
      default: 'approved'
    },
    moderationNotes: { type: String },
    
    helpfulVotes: [{
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      isHelpful: { type: Boolean },
      votedAt: { type: Date }
    }],
    
    isEdited: { type: Boolean, default: false },
    editHistory: [{
      comment: { type: String },
      editedAt: { type: Date }
    }],
    
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

ShopReviewSchema.index({ shop: 1, createdAt: -1 });
ShopReviewSchema.index({ user: 1, shop: 1 }, { unique: true });
ShopReviewSchema.index({ rating: 1 });
ShopReviewSchema.index({ isVerifiedPurchase: 1 });
ShopReviewSchema.index({ isApproved: 1 });
ShopReviewSchema.index({ 'sellerResponse.respondedAt': -1 });

export const ShopReview: Model<IShopReview> = models.ShopReview || model<IShopReview>('ShopReview', ShopReviewSchema);