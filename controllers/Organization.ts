import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import models from "../models";
const { Organization } = models;

class OrganizationController {
  public async registerRoutes(fastify: FastifyInstance) {
    fastify.post("/organization", this.addOrganization);
    fastify.get("/organization", this.getOrganizations);
  }

  private async addOrganization(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name } = request.body as { name: string };

      if (!name) {
        return reply.status(400).send({ error: "Organization name is required" });
      }

      const existingOrg = await Organization.findOne({ name });
      if (existingOrg) {
        return reply.status(400).send({ error: "Organization already exists" });
      }

      const newOrganization = new Organization({ name });
      await newOrganization.save();

      return reply.status(201).send({ message: "Organization added successfully", organization: newOrganization });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Error adding organization", error });
    }
  }

  private async getOrganizations(request: FastifyRequest, reply: FastifyReply) {
    try {
      const organizations = await Organization.find();
      return reply.status(200).send({ organizations });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Error fetching organizations", error });
    }
  }
}

export const organizationController = new OrganizationController();
