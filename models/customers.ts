import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  username: string;
  mobileNumber: string;
  location: {
    city: string;
    state: string;
    country: string;
    address: string;
  };
  notes: string;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  active: boolean;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true, unique: true },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      address: { type: String, required: true },
    },
    notes: { type: String, default: "" },
    deleted_at: { type: Date, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    is_deleted: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CustomerModel = mongoose.model<ICustomer>("Customer", CustomerSchema);
