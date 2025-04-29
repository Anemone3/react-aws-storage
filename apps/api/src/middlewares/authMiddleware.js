import { ApiError } from "../config/apiError.js";
import { ACCESS_JWT_KEY } from "../config/config.js";
import { prisma } from "../config/prisma.js";
import { verifyToken } from "../services/jwt-service.js";
import { getUserByEmail } from "../services/user-service.js";

export class AuthMiddleware {
  static validateJwt = async (req, res, next) => {
    const authorization = req.headers["authorization"];

    try {
      if (!authorization) {
        throw new ApiError("Unauthorized, Missing header Authorization", 401);
      }

      if (!authorization.startsWith("Bearer ")) {
        throw new ApiError("Unauthorized, Missing Bearer", 401);
      }

      const token = authorization.split(" ")[1] || "";

      if (!token) {
        throw new ApiError("Unauthorized, No token found", 401);
      }

      const payload = await verifyToken(token, ACCESS_JWT_KEY);

      if (!payload) {
        throw new ApiError("Unauthorized, Invalid token", 401);
      }
      console.log("payload-middleware", payload);
      const user = await getUserByEmail(payload.email);

      req.user = {
        id: user.id,
        email: user.email,
      };

      next();
    } catch (error) {
      next(error);
    }
  };

  static ownerShip =
    ({ request = "params", key = "userId", resource = "" }) =>
    async (req, res, next) => {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized: Missing or invalid token" });
      }

      const resourceId = req[request]?.[key];

      if (!resourceId) {
        return res.status(400).json({
          message: `Bad Request: Missing ${key} in ${request}`,
        });
      }

      if (key === "userId") {
        if (String(resourceId) !== req.user.id) {
          return res.status(403).json({ message: "Unauthorized access", error: "Non-owner" });
        }
      }

      try {
        if (resource) {
          const resourceData = await prisma[resource].findUnique({
            where: { id: Number(resourceId) },
            select: { userId: true },
          });

          console.log(resourceData);
          if (!resourceData) {
            return res.status(404).json({ message: `${resource} not found` });
          }

          if (String(resourceData.userId) !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access", error: "Non-owner" });
          }
        }

        next();
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
      }
    };
}
