import { Router } from "express";
import {
  register,
  login,
  refreshAccessToken,
} from "../controllers/auth-controller.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "prueba" });
});

router.post("/register", register);
router.post("/login", login);
router.post("/refreshToken", refreshAccessToken);

export default router;
