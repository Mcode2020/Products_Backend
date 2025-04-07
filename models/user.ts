import mongoose, { Document, Schema, model } from "mongoose";

export interface UserDocument extends Document {
    name: string;
    username: string;
    mobileNumber: string;
    email: string;
    password: string;
    deleted_at: Date | null;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
    active: boolean;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    deleted_at: { type: Date, default: null },
    is_deleted: { type: Schema.Types.Boolean, default: false },
    active: { type: Schema.Types.Boolean, default: true },
  },
  {
    timestamps: { currentTime: () => new Date().valueOf() }, 
  }
);

export const UserModel = model<UserDocument>("User", UserSchema);
