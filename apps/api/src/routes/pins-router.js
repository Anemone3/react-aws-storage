import { Router } from "express";
import { createPins, deletePin, getAllPinsController, getPins } from "../controllers/pines-controller.js";
import { uploadFileMiddleware } from "../middlewares/uploadFileMiddleware.js";
import { multerErrorHandler } from "../shared/uploadFileHandler.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post(
  "/:userId",
  AuthMiddleware.validateJwt,
  AuthMiddleware.ownerShip({ request: "params", key: "userId", resource: null }),
  multerErrorHandler(uploadFileMiddleware.single("file")),
  createPins
);
router.get("/", getAllPinsController);
//TODO: getPinsByUser
router.get("/image/:id", getPins);

router.delete("/:pinId", deletePin);

export default router;
