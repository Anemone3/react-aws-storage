import { Router } from "express";
import { register, login, refreshAccessToken, logout, googleAuthCallback } from "../controllers/auth-controller.js";
import passport from "passport";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "prueba" });
});

router.post("/register", register);
router.post("/login", login);
router.post("/token", refreshAccessToken);
router.post("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // -> [profile] -> me da el nombre y la foto de perfil, [email] -> me da el correo electrónico
    prompt: "consent select_account",
  })
);
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/" }), googleAuthCallback);

export default router;
