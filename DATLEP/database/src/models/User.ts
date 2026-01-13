import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String
    },
    following: {
      type: [String],
      default: []
    },
    avatar: {
      type: Schema.Types.ObjectId,
      ref: 'Image'
    }
  },
  { timestamps: true }
);

export const User = models.User || model('User', UserSchema);
