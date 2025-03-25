import { Router } from "express";
import { createPins, getPins } from "../controllers/pines-controller.js";
import { uploadFileMiddleware } from "../middlewares/uploadFileMiddleware.js";
import { multerErrorHandler } from "../shared/uploadFileHandler.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post(
  "/:userId",
  AuthMiddleware.validateJwt,
  AuthMiddleware.ownerShip({ request: "params",key: 'userId' }),
  multerErrorHandler(uploadFileMiddleware.single("file")),
  createPins
);

router.get("/image/:id", getPins);

export default router;
