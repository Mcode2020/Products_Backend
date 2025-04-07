import Fastify from "fastify";
import { dbConnection, dbUrl } from './models/db';
import dotenv from 'dotenv';
import { setupRoutes } from "./routes";
import fastifyStatic from "@fastify/static";
import path from "path";

dotenv.config();

const fastify = Fastify({ logger: true });
fastify.register(fastifyStatic, {
  root: "D:/Products/invoices",
  prefix: "/invoices/", 
});


fastify.get("/", async () => {
  return { message: "Hello, Fastify with TypeScript!" };
});

setupRoutes(fastify);

dbConnection.once('open', () => {
  console.log(`Connected to MongoDB `);
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("Server is running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

dbConnection.on('error', (error) => {
  console.error('Unable to connect to MongoDB.');
  console.error(error);
});

start();
