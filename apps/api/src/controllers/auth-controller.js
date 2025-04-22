import { createUser, getUserByEmail, getUserByProvider } from "../services/user-service.js";
import { comparePassword, hashPassword } from "../shared/bcrypt.js";
import { generateToken, verifyToken } from "../services/jwt-service.js";
import { ApiError } from "../config/apiError.js";
import { validateEmail } from "../shared/validateEmail.js";
import { ACCESS_JWT_KEY, FRONTEND_URL, NODE_ENV } from "../config/config.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "El email no es válido" });
  }
  if (!password || !email) {
    return res.status(400).json({ message: "Faltan campos (email or password)" });
  }

  try {
    const { password: passwordUser, provider, ...user } = await getUserByEmail(email);

    if (provider !== "LOCAL") {
      return res.status(400).json({ message: "This email is authenticate with other provider" });
    }

    const isMatched = comparePassword(password, passwordUser);

    if (!isMatched) return res.status(400).json({ message: "Invalid Credentials" });

    const refreshToken = await generateToken({ id: user.id, email: user.email }, "7d");

    const accessToken = await generateToken({ id: user.id, email: user.email }, "15m");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: NODE_ENV !== "development" ? "None" : "Lax",
      secure: NODE_ENV !== "development",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Logged succesfully",
      accessToken,
      data: user,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: "Invalid Credentials" });
    }

    if (error.code === "P2025") {
      throw new ApiError("No existe una cuenta creada con este correo.", 404);
    }

    throw error;
  }
};

export const register = async (req, res) => {
  const { email, password, firstname, lastname } = req.body;

  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({ message: "Faltan campos (email, password, firstname,lastname)" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "El email no es válido" });
  }

  const hashedPassword = hashPassword(password);

  try {
    const user = await createUser({
      email,
      firstname,
      lastname,
      username: `${firstname}.${lastname}`,
      password: hashedPassword,
    });

    delete user.password;

    const refreshToken = await generateToken({ id: user.id, email: user.email }, "7d");

    const accessToken = await generateToken({ id: user.id, email: user.email }, "15m");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: NODE_ENV !== "development" ? "None" : "Lax",
      secure: NODE_ENV !== "development",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Register succesfully",
      accessToken,
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  console.log("COOKIES DISPONIBLES:", req.cookies);

  //console.log("body", req.body);
  let tokenProvider = refreshToken || req.body.provideAuth;

  if (refreshToken && req.body.provideAuth) {
    tokenProvider = refreshToken;
  }

  let payload;

  try {
    console.log("Token provider", tokenProvider);
    payload = await verifyToken(tokenProvider, ACCESS_JWT_KEY);

    if (!payload) {
      return res.status(403).json({ message: "Retry auth", error: "No token provider" });
    }

    let user;
    if (payload.provider) {
      console.log("Entre desde el provider", { ...payload });
      user = await getUserByProvider(payload.provider, payload.providerId);

      res.clearCookie("provideAuth");

      const refreshToken = await generateToken({ id: user.id, email: user.email }, "7d");

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: NODE_ENV !== "development" ? "None" : "Lax",
        secure: NODE_ENV !== "development",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    } else {
      console.log("Entre desde el email", { ...payload });
      user = await getUserByEmail(payload.email);
    }

    const accessToken = await generateToken({ id: user.id, email: user.email }, "15m");

    delete user.password;

    res.status(200).json({
      message: "Authenticate",
      accessToken: accessToken,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const googleAuthCallback = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "No se pudo autenticar con Google" });
  }

  const provideAuth = await generateToken({ id: user.providerId, provider: user.provider, success: true }, "30s");

  const redirectUrl = `${FRONTEND_URL}/success?auth=${provideAuth}`;

  res.cookie("provideAuth", provideAuth, {
    httpOnly: true,
    sameSite: NODE_ENV === "development" ? "Lax" : "None",
    secure: NODE_ENV !== "development",
    maxAge: 2 * 60 * 1000,
  });

  return res.redirect(redirectUrl);
};

export const logout = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: NODE_ENV !== "development" ? "None" : "Lax",
    secure: NODE_ENV !== "development",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};
