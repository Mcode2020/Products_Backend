import mongoose, { Document, Schema, model } from "mongoose";

export interface InventoryDocument extends Document {
  productId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId; 
  price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

const InventorySchema = new Schema<InventoryDocument>(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true }, 
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
  },
  { timestamps: true } 
);

export const InventoryModel = model<InventoryDocument>("Inventory", InventorySchema);
