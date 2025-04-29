import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";
import { updateUserData } from "../controllers/user-controller.js";
import { uploadFileMiddleware } from "../middlewares/uploadFileMiddleware.js";
import { multerErrorHandler } from "../shared/uploadFileHandler.js";
const router = Router();

router.patch(
  "/:id",
  AuthMiddleware.validateJwt,
  AuthMiddleware.ownerShip({ request: "params", key: "id", resource: null }),
  multerErrorHandler(uploadFileMiddleware.single("file")),
  updateUserData
);

export default router;
