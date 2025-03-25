import { ApiError } from "../config/apiError.js";
import { ACCESS_JWT_KEY } from "../config/config.js";
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
    ({ request = "params", key = "userId" }) =>
    (req, res, next) => {
      if (!req.user || !req.user.id) {
        return res
          .status(401)
          .json({ message: "Unauthorized: Missing or invalid token" });
      }

      const id = req[request]?.[key];

      if (!id) {
        return res.status(400).json({
          message: `Bad Request: Missing ${key} in ${request}`,
        });
      }

      if (String(id) !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Unauthorized access", error: "Non-owner" });
      }

      next();
    };
}
