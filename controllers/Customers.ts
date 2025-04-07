import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import models from "../models";

const { Customer } = models;

class CustomerController {
  public async registerRoutes(fastify: FastifyInstance) {
    fastify.post("/customers", this.addCustomer);
    fastify.get("/customers", this.getAllCustomers);
  }

  private async addCustomer(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, username, mobileNumber, location, notes } = request.body as {
        name: string;
        username: string;
        mobileNumber: string;
        location: { city: string; state: string; country: string; address: string };
        notes?: string;
      };

      const existingCustomer = await Customer.findOne({ username });
      if (existingCustomer) {
        return reply.status(400).send({ error: "Username already exists" });
      }

      const newCustomer = new Customer({
        name,
        username,
        mobileNumber,
        location,
        notes,
      });

      await newCustomer.save();

      return reply.status(201).send({ message: "Customer added successfully", customer: newCustomer });
    } catch (error) {
      console.error("Error adding customer:", error);
      return reply.status(500).send({ message: "Internal server error", error });
    }
  }

  private async getAllCustomers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const customers = await Customer.find({ is_deleted: false });
      return reply.status(200).send({ customers });
    } catch (error) {
      console.error("Error fetching customers:", error);
      return reply.status(500).send({ message: "Internal server error", error });
    }
  }
}

export const customerController = new CustomerController();
