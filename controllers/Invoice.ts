import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import models from "../models";

const { Invoice, Order, Product, Inventory } = models;

class InvoiceController {
  public async registerRoutes(fastify: FastifyInstance) {
    fastify.post("/invoice", this.generateInvoice);
  }

  private async generateInvoice(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { orderId, paymentType, discount, tax, paymentStatus } = request.body as {
            orderId: string;
            paymentType: "manual" | "online";
            discount: number;
            tax: number;
            paymentStatus: "pending" | "paid";
        };

        const order = await Order.findById(orderId);
        if (!order) {
            return reply.status(404).send({ message: "Order not found" });
        }
        const product = await Product.findById(order.productId);
        if (!product) { 
            return reply.status(404).send({ message: "Product not found" });
        }

        const inventory = await Inventory.findOne({ productId: order.productId });

        const invoicesDir = path.join(__dirname, "../invoices");
        if (!fs.existsSync(invoicesDir)) {  
            fs.mkdirSync(invoicesDir, { recursive: true });
        } 

        const invoicePath = path.join(invoicesDir, `invoice_${orderId}.pdf`);
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(invoicePath);
        doc.pipe(writeStream);
 
        doc.fontSize(20).text("Invoice", { align: "center" });
        doc.moveDown();

        doc.fontSize(16).text("Order Details", { underline: true });
        doc.fontSize(14).text(`Order ID: ${orderId}`);
        doc.text(`Price: $${order.price}`);
        doc.text(`Quantity: ${order.quantity}`); 
        doc.text(`Unit: ${order.unit}`);

        +
        doc.text(`Sell Type: ${order.sellType}`);
        doc.text(`Order Status: ${order.status}`);
        doc.text(`Mark as Inventory: ${order.markAsInventory ? "Yes" : "No"}`);
        doc.moveDown();
 
        doc.fontSize(16).text("Product Details", { underline: true });
        doc.fontSize(14).text(`Product Name: ${product.name}`);
        doc.text(`Product ID: ${product._id}`);  
        doc.text(`Vendor ID: ${product.vendorId}`);
        if (product.image) {
            doc.text(`Image URL: ${product.image}`);
        }

        doc.fontSize(16).text("Product Variations:");
        for (const [key, value] of Object.entries(product.variations.details)) {
          if (Array.isArray(value)) {
            doc.fontSize(12).text(`${key}: ${value.join(", ")}`);
          } else {
            doc.fontSize(12).text(`${key}: ${value}`);
          }
        }
        doc.moveDown();

        if (inventory) {
            doc.fontSize(16).text("Inventory Details", { underline: true });
            doc.fontSize(14).text(`Stock Available: ${inventory.quantity}`);
            doc.text(`Inventory ID: ${inventory._id}`);
            doc.moveDown();
        }

        doc.fontSize(16).text("Payment Summary", { underline: true });
        doc.fontSize(14).text(`Payment Type: ${paymentType}`);
        doc.text(`Payment Status: ${paymentStatus}`);
        doc.text(`Discount: $${discount}`);
        doc.text(`Tax: $${tax}`);
        doc.text(`Total: $${order.price - discount + tax}`);



        doc.end();

        await new Promise<void>((resolve) => writeStream.on("finish", resolve));

        // Save Invoice Data
        const newInvoice = new Invoice({
            orderId,
            invoiceUrl: `http://localhost:3000/invoices/invoice_${orderId}.pdf`,
            paymentType,
            discount,
            tax,
            paymentStatus,
        });

        await newInvoice.save();

        if (paymentStatus === "paid") {
            await Order.findByIdAndUpdate(orderId, { status: "completed" });

            if (inventory) {
                inventory.quantity = 0;
                await inventory.save();
            }
        }

        return reply.status(201).send({
            message: "Invoice generated successfully",
            invoice: newInvoice,
        });
    } catch (error) {
        console.error("Error generating invoice:", error);
        return reply.status(500).send({ message: "Internal server error", error });
    }
  }
}

export const invoiceController = new InvoiceController();
