import { Request } from 'express';
import { Schema } from 'mongoose';

export interface SellerPayload {
  id: Schema.Types.ObjectId | string;
}

export interface SellerRequest extends Request {
  seller?: SellerPayload;
}
