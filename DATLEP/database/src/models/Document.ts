import { Schema, model, models, Model } from 'mongoose';

export interface IFileDocument {
  title: string;
  description?: string;
  fileUrl: string;
  fileType: 'pdf' | 'doc' | 'docx' | 'jpg' | 'png' | 'video';
  uploadedBy?: Schema.Types.ObjectId;
  size?: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FileDocumentSchema = new Schema<IFileDocument>(
  {
    title: { type: String, required: true },
    description: String,
    fileUrl: { type: String, required: true },
    fileType: {
      type: String,
      enum: ['pdf', 'doc', 'docx', 'jpg', 'png', 'video'],
      required: true
    },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'Seller' },
    size: Number,
    isPublic: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const FileDocument: Model<IFileDocument> =
  models.FileDocument || model<IFileDocument>('FileDocument', FileDocumentSchema);
