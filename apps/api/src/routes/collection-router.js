import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";
import {
  addPinToCollection,
  createCollections,
  getAllCollectionsByUser,
  getCollection,
  removePinCollection,
} from "../controllers/collections-controller.js";

const router = Router();

router.get("/", getCollection);
router.get("/:id", getAllCollectionsByUser);

router.post("/:id/collections", AuthMiddleware.validateJwt, AuthMiddleware.ownerShip({ request: "params", key: "id" }), createCollections);

router.delete("/:userId", AuthMiddleware.validateJwt, AuthMiddleware.ownerShip({ request: "params", key: "userId" }), removePinCollection);

router.post(
  "/:collectionId/pins/:pinId",
  AuthMiddleware.validateJwt,
  AuthMiddleware.ownerShip({ request: "params", key: "collectionId", resource: "collections" }),
  addPinToCollection
);
export default router;
