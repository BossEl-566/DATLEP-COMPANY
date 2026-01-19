import { Schema, model, models } from 'mongoose';

const ImageSchema = new Schema(
  {
    file_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      unique: true
    },
  },
  { timestamps: true }
);

export const Image = models.Image || model('Image', ImageSchema);
