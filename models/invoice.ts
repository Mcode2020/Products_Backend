import mongoose, { Document, Schema, model } from "mongoose";

export interface InvoiceDocument extends Document {
  orderId: mongoose.Types.ObjectId;
  invoiceUrl: string;
  paymentType: "manual" | "online";
  discount: number;
  tax: number;
  paymentStatus: "pending" | "paid";
  created_at: Date;
  updated_at: Date;
}

const InvoiceSchema = new Schema<InvoiceDocument>(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    invoiceUrl: { type: String, required: false },
    paymentType: { type: String, enum: ["manual", "online"], required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  },
  { timestamps: true } 
);

export const InvoiceModel = model<InvoiceDocument>("Invoice", InvoiceSchema);
