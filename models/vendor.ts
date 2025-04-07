import mongoose, { Document, Schema, model } from "mongoose";

export interface VendorDocument extends Document {
  name: string;
  username: string;
  mobileNumber: string;
  location: {
    city: string;
    state: string;
    country: string;
    address: string;
  };
  notes?: string;
  deleted_at: Date | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  active: boolean;
}

const VendorSchema = new Schema<VendorDocument>(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    mobileNumber: { type: String, required: true },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      address: { type: String, required: true },
    },
    notes: { type: String, default: "" },
    deleted_at: { type: Date, default: null },
    is_deleted: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const VendorModel = model<VendorDocument>("Vendor", VendorSchema);
