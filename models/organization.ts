import mongoose, { Document, Schema, model } from "mongoose";

export interface OrganizationDocument extends Document {
    name: string;
    created_at: string;
    updated_at: string;
}

const OrganizationSchema = new Schema<OrganizationDocument>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: { currentTime: () => new Date().valueOf() }, 
  }
);

export const OrganizationModel = model<OrganizationDocument>("Organization", OrganizationSchema);
