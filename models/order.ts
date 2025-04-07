import mongoose, { Document, Schema, model } from "mongoose";

export interface OrderDocument extends Document {
  productId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  price: number;
  quantity: number;
  unit: string;
  sellType: "customer" | "self";
  status: "in progress" | "pending" | "completed";
  markAsInventory: boolean;
  deductionType: "vendor" | "inventory"; 
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

const OrderSchema = new Schema<OrderDocument>(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: false },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    sellType: { type: String, enum: ["customer", "self"], required: true },
    status: { type: String, enum: ["in progress", "pending", "completed"], default: "pending" },
    markAsInventory: { type: Boolean, default: false },
    deductionType: { type: String, enum: ["vendor", "inventory"], required: true }, 
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const OrderModel = model<OrderDocument>("Order", OrderSchema);
