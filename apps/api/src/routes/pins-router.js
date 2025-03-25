import { Router } from "express";
import { createPins, getPins } from "../controllers/pines-controller.js";
import { uploadFileMiddleware } from "../middlewares/uploadFileMiddleware.js";
import { multerErrorHandler } from "../shared/uploadFileHandler.js";

const router = Router();

router.post(
  "/pins/:userId",
  multerErrorHandler(uploadFileMiddleware.single("file")),
  createPins
);

router.get("/pins", getPins);

export default router;
