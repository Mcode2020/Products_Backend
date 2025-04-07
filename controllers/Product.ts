import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import models from "../models";
import mongoose from "mongoose";

const { Product } = models;

class ProductController {
  public async registerRoutes(fastify: FastifyInstance) {
    fastify.post("/products", this.addProduct);
    fastify.get("/products", this.getAllProducts);
  }

  private async addProduct(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, vendorId, image, variations } = request.body as {
        name: string;
        vendorId: string;
        image?: string;
        variations: Record<string, any>;
      };

      const newProduct = new Product({
        name,
        vendorId,
        image: image || null,
        variations: {
          _id: new mongoose.Types.ObjectId(), 
          details: variations, 
        },
      });

      await newProduct.save();

      return reply.status(201).send({ message: "Product added successfully", product: newProduct });
    } catch (error) {
      console.error("Error adding product:", error);
      return reply.status(500).send({ message: "Internal server error", error });
    }
  }

  private async getAllProducts(request: FastifyRequest, reply: FastifyReply) {
    try {
      const products = await Product.find({ is_deleted: false }).populate("vendorId");
      return reply.status(200).send({ products });
    } catch (error) {
      console.error("Error fetching products:", error);
      return reply.status(500).send({ message: "Internal server error", error });
    }
  }
}

export const productController = new ProductController();
