import mongoose, { Document, Schema, model } from "mongoose";

export interface ProductDocument extends Document {
  name: string;
  vendorId: mongoose.Types.ObjectId;
  image?: string;
  variations: {
    length: number;
    forEach(arg0: (variation: any, index: number) => void): unknown;
    _id: mongoose.Types.ObjectId; 
    details: Record<string, any>;
  };
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    image: { type: String, default: null },
    variations: {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, 
      details: { type: Schema.Types.Mixed, default: {} },
    },

    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ProductModel = model<ProductDocument>("Product", ProductSchema);
