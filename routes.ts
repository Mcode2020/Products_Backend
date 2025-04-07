import { FastifyInstance } from "fastify";
import { userController } from "./controllers/Users";
import { organizationController } from "./controllers/Organization";
import { memberController } from "./controllers/Members";
import { customerController } from "./controllers/Customers";
import { vendorController } from "./controllers/Vendor";
import { productController } from "./controllers/Product";
import { orderController } from "./controllers/Orders";
import { revenueController } from "./controllers/Revenue";
import { invoiceController } from "./controllers/Invoice";



export function setupRoutes(fastify: FastifyInstance) {
    userController.registerRoutes(fastify);
    organizationController.registerRoutes(fastify);
    memberController.registerRoutes(fastify);
    customerController.registerRoutes(fastify);
    vendorController.registerRoutes(fastify);
    productController.registerRoutes(fastify);
    orderController.registerRoutes(fastify);
    revenueController.registerRoutes(fastify);
    invoiceController.registerRoutes(fastify)

    fastify.all("*", async (request, reply) => {
        console.log("All done");
        reply.status(404).send({ message: "Invalid route" });
    });
}
