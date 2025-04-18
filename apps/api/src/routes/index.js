import { Router } from "express";
import PinsRouter from "./pins-router.js";
import AuthRouter from "./auth-router.js";
import CollectionRouter from "./collection-router.js";
import UserRouter from "./user-router.js";

export class AppRouter {
  static get routes() {
    const router = Router();

    router.use("/pins", PinsRouter);
    router.use("/auth", AuthRouter);
    router.use("/collection", CollectionRouter);
    router.use("/user", UserRouter);
    return router;
  }
}
