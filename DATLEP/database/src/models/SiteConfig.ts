import { Schema, model, Document } from "mongoose";

export interface SiteConfigDocument extends Document {
  categories: string[];
  subCategories: Record<string, string[]>;
  createdAt: Date;
  updatedAt: Date;
}

const SiteConfigSchema = new Schema<SiteConfigDocument>(
  {
    categories: {
      type: [String],
      required: true,
      default: []
    },

    subCategories: {
      type: Map,
      of: [String],
      default: {},

      validate: {
        validator: function (this: SiteConfigDocument, value: Map<string, string[]>) {
          const categorySet = new Set(this.categories);
          return Array.from(value.keys()).every(key => categorySet.has(key));
        },
        message: "SubCategories cannot exist without a corresponding category"
      }
    }
  },
  {
    timestamps: true
  }
);

export const SiteConfigModel = model<SiteConfigDocument>(
  "SiteConfig",
  SiteConfigSchema
);
