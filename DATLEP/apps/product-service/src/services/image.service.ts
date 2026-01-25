import { Image } from '@datlep/database';
import { Types } from 'mongoose';

interface CreateImageInput {
  fileId: string;
  url: string;
  format?: string;
  size?: number;
}

export const createImage = async (
  data: CreateImageInput,
  uploadedBy: Types.ObjectId,
  usedIn: {
    productId?: Types.ObjectId;
    userId?: Types.ObjectId;
    shopId?: Types.ObjectId | undefined;
  }
) => {
  if (!data.fileId || !data.url) {
    throw new Error('fileId and url are required');
  }

  return await Image.create({
    ...data,
    uploadedBy,
    usedIn: {
      products: usedIn.productId ? [usedIn.productId] : [],
      users: usedIn.userId ? [usedIn.userId] : [],
      shops: usedIn.shopId ? [usedIn.shopId] : []
    }
  });
};
