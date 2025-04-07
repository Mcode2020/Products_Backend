import { FastifyRequest, FastifyReply } from "fastify";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

interface AuthenticatedRequest extends FastifyRequest {
  user?: any;
}

const verifyToken = async (req: AuthenticatedRequest, reply: FastifyReply) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "");
  let refreshToken = req.headers["x-refresh-token"];

  if (Array.isArray(refreshToken)) {
    refreshToken = refreshToken[0];
  }

  if (!accessToken && !refreshToken) {
    return reply.status(401).send({ message: "No tokens provided" });
  }

  try {
    if (accessToken) {
      const decoded: any = jwt.verify(accessToken, process.env.TOKEN_SECRET as string);
      console.log("Decoded access token payload:", decoded);

      req.user = decoded;
      return;
    }

    if (refreshToken) {
      const decodedRefresh: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
      console.log("Decoded refresh token payload:", decodedRefresh);

      const newAccessToken = jwt.sign(
        { clientId: decodedRefresh.clientId },
        process.env.TOKEN_SECRET as string,
        { expiresIn: "30m" }
      );

      reply.header("Authorization", `Bearer ${newAccessToken}`);
      req.user = decodedRefresh;
      return;
    }
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      return reply.status(401).send({ message: "Token expired", error: error.message });
    } else if (error instanceof JsonWebTokenError) {
      return reply.status(403).send({ message: "Invalid token", error: error.message });
    } else {
      console.error("Unknown error:", error);
      return reply.status(500).send({ message: "Internal server error", error: error.message });
    }
  }
};

export default verifyToken;
