import { Schema, model, models } from 'mongoose';

const ImageSchema = new Schema(
  {
    fileId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true
    },
    format: String,
    size: Number,

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Seller',
      required: true
    },

    usedIn: {
      users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      shops: [{ type: Schema.Types.ObjectId, ref: 'Shop' }],
      products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Image = models.Image || model('Image', ImageSchema);
