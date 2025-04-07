import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import models from "../models";

const { Order } = models;

class RevenueController {
  public async registerRoutes(fastify: FastifyInstance) {
    fastify.get("/revenue", this.getRevenue);
  }

  private async getRevenue(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { year, month } = request.query as { year?: string; month?: string };
      const filters: any = {};

      if (year) {
        const numericYear = parseInt(year, 10);
        filters.created_at = {
          $gte: new Date(numericYear, 0, 1, 0, 0, 0, 0), 
          $lte: new Date(numericYear, 11, 31, 23, 59, 59, 999),
        };
      }

      if (year && month) {
        const numericYear = parseInt(year, 10);
        const numericMonth = parseInt(month, 10) - 1
        filters.created_at = {
          $gte: new Date(numericYear, numericMonth, 1, 0, 0, 0, 0), 
          $lte: new Date(numericYear, numericMonth + 1, 0, 23, 59, 59, 999), 
        };
      }

      
      const revenueData = await Order.aggregate([
        { $match: filters },
        {
          $group: {
            _id: { month: { $month: "$created_at" }, year: { $year: "$created_at" } },
            totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } },
            totalOrders: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      return reply.status(200).send({ success: true, revenue: revenueData });
    } catch (error) {
      console.error("Error fetching revenue:", error);
      return reply.status(500).send({ message: "Internal server error", error });
    }
  }
}

export const revenueController = new RevenueController();
