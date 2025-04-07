import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import models from "../models";

const { Vendor } = models;

class VendorController {
  public async registerRoutes(fastify: FastifyInstance) {
    fastify.post("/vendors", this.addVendor);
    fastify.get("/vendors", this.getAllVendors);
  }

  private async addVendor(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, username, mobileNumber, location, notes } = request.body as {
        name: string;
        username: string;
        mobileNumber: string;
        location: { city: string; state: string; country: string; address: string };
        notes?: string;
      };

      const existingVendor = await Vendor.findOne({ username });
      if (existingVendor) {
        return reply.status(400).send({ error: "Username already exists" });
      }

      const newVendor = new Vendor({
        name,
        username,
        mobileNumber,
        location,
        notes,
      });

      await newVendor.save();

      return reply.status(201).send({ message: "Vendor added successfully", vendor: newVendor });
    } catch (error) {
      console.error("Error adding vendor:", error);
      return reply.status(500).send({ message: "Internal server error", error });
    }
  }

  private async getAllVendors(request: FastifyRequest, reply: FastifyReply) {
    try {
      const vendors = await Vendor.find({ is_deleted: false });
      return reply.status(200).send({ vendors });
    } catch (error) {
      console.error("Error fetching vendors:", error);
      return reply.status(500).send({ message: "Internal server error", error });
    }
  }
}

export const vendorController = new VendorController();
