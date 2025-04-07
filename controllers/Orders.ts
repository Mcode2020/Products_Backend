import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import models from "../models";

const { Order, Inventory, Product } = models;

class OrderController {
  public async registerRoutes(fastify: FastifyInstance) {
    fastify.post("/orders", this.addOrder);
    fastify.get("/inventory", this.getAllInventory);

  }

  private async addOrder(request: FastifyRequest, reply: FastifyReply) {
    try {
      const {
        productId,
        vendorId,
        price,
        quantity,
        unit,
        sellType,
        status,
        markAsInventory,
        deductionType,
      } = request.body as {
        productId: string;
        vendorId: string;
        price: number;
        quantity: number;
        unit: string;
        sellType: "customer" | "self";
        status?: "in progress" | "pending" | "completed";
        markAsInventory?: boolean;
        deductionType: "vendor" | "inventory";
      };

      const newOrder = new Order({
        productId,
        vendorId,
        price,
        quantity,  
        unit,
        sellType,
        status: status || "pending",
        markAsInventory: markAsInventory ?? false,
        deductionType, 
      });

      await newOrder.save();

      if (markAsInventory) {
        const existingInventory = await Inventory.findOne({ productId });

        if (deductionType === "vendor" && !vendorId) {
          return reply.status(400).send({ message: "Vendor ID is required when deductionType is vendor." });
        }
        if (existingInventory) {
          existingInventory.price = price;
          existingInventory.quantity += quantity; 
          await existingInventory.save();
        } else {  
          const newInventory = new Inventory({
            productId,
            orderId: newOrder._id,  
            price,
            quantity
          });
          await newInventory.save();
        }
      }

      return reply.status(201).send({ message: "Order created successfully", order: newOrder });
    } catch (error) {
      console.error("Error creating order:", error);
      return reply.status(500).send({ message: "Internal server error", error });
    }
  }
    private async getAllInventory(request: FastifyRequest, reply: FastifyReply) {
      try {
        const inventoryList = await Inventory.find()
          .populate("productId")
          .populate("orderId");
  
        return reply.status(200).send({ inventory: inventoryList });
      } catch (error) {
        console.error("Error fetching inventory:", error);
        return reply.status(500).send({ message: "Internal server error", error });
      }
    }
}

export const orderController = new OrderController();
