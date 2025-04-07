import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import models from "../models";
import bcrypt from "bcrypt";

const { Member, Organization } = models;

class MemberController {
  public async registerRoutes(fastify: FastifyInstance) {
    fastify.post("/members", this.createMember);
    fastify.get("/members", this.getMembers);
    fastify.get("/members/:id", this.getMemberById);
   
  }

  private async createMember(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, username, mobileNumber, email, password, type, role, organizationId } = request.body as {
        name: string;
        username: string;
        mobileNumber: string;
        email: string;
        password: string;
        type: "email" | "phoneNumber" | "manual";
        role: "owner" | "editor" | "viewer";
        organizationId: string;
      };

      const organization = await Organization.findById(organizationId);
      if (!organization) {
        return reply.status(400).send({ message: "Invalid organization ID" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newMember = new Member({
        name,
        username,
        mobileNumber,
        email,
        password: hashedPassword,
        type: type || "manual",
        role,
        organizationId,
      });

      await newMember.save();

      return reply.status(201).send({ message: "Member created successfully", member: newMember });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Error creating member", error });
    }
  }

  private async getMembers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { organizationId } = request.query as { organizationId?: string };

      let query = {};
      if (organizationId) {
        query = { organizationId };
      }

      const members = await Member.find(query).populate("organizationId", "name");
      return reply.status(200).send(members);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Error retrieving members", error });
    }
  }

  private async getMemberById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const member = await Member.findById(id).populate("organizationId", "name");

      if (!member) {
        return reply.status(404).send({ message: "Member not found" });
      }

      return reply.status(200).send(member);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Error retrieving member", error });
    }
  }
}

export const memberController = new MemberController();
