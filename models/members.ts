import mongoose, { Document, Schema, model } from "mongoose";

export interface MemberDocument extends Document {
    name: string;
    username: string;
    mobileNumber: string;
    email: string;
    password: string;
    type: "email" | "phoneNumber" | "manual";
    role: "owner" | "editor" | "viewer";
    organizationId: mongoose.Types.ObjectId;
    deleted_at: Date | null;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
    active: boolean;
}

const MemberSchema = new Schema<MemberDocument>(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    type: { type: String, enum: ["email", "phoneNumber", "manual"], default: "manual" },
    role: { type: String, enum: ["owner", "editor", "viewer"], required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    deleted_at: { type: Date, default: null },
    is_deleted: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: { currentTime: () => new Date().valueOf() }, 
  }
);

export const MemberModel = model<MemberDocument>("Member", MemberSchema);
