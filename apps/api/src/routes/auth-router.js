import { Router } from "express";
import { register, login } from "../controllers/auth-controller.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "prueba" });
});

router.post("/register" ,register);
router.post("/login", login);

export default router;
