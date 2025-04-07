import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import models from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { User } = models;

class UserController {
  public async registerRoutes(fastify: FastifyInstance) {
    fastify.post("/login", this.login);
    fastify.post("/register", this.registerUser);
  }

  private async login(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { identifier, password } = request.body as { identifier: string; password: string };

        const user = await User.findOne({
            $or: [
                { username: identifier },
                { email: identifier },
                { mobileNumber: identifier }
            ]
        });

        if (!user) {
            return reply.status(400).send({ error: "Invalid credentials" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return reply.status(400).send({ error: "Invalid credentials" });
        }

        const tokenSecret = process.env.TOKEN_SECRET || "default_secret";
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret";

        const token = jwt.sign(
            { userId: user._id, email: user.email, name: user.name },
            tokenSecret,
            { expiresIn: "1d" }
        );

        const refreshToken = jwt.sign(
            { userId: user._id, email: user.email, name: user.name },
            refreshTokenSecret,
            { expiresIn: "45m" }
        );

        return reply.status(200).send({
            message: "Login successful",
            token,
            refreshToken,
            name: user.name,
            _id: user._id,
        });

    } catch (error) {
        console.error(error);
        return reply.status(500).send({ message: "Internal server error", error });
    }
}


  private async registerUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, username, mobileNumber, email, password } = request.body as {
        name: string;
        username: string;
        mobileNumber: string;
        email: string;
        password: string;
      };

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        username,
        mobileNumber,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      return reply.status(201).send({ message: "User registered successfully", user: newUser });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Error creating user", error });
    }
  }
}

export const userController = new UserController();
