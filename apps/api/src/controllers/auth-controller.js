import { createUser, getUserByEmail } from "../services/user-service.js";
import { comparePassword, hashPassword } from "../shared/bcrypt.js";
import { generateToken, verifyToken } from "../services/jwt-service.js";
import { ApiError } from "../config/apiError.js";
import { validateEmail } from "../shared/validateEmail.js";
import { ACCESS_JWT_KEY, FRONTEND_URL } from "../config/config.js";

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
      sameSite: "None",
      secure: process.env.NODE_ENV !== "development",
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
      sameSite: "None",
      secure: process.env.NODE_ENV !== "development",
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
  let payload;
  if (!refreshToken) return res.status(403).json({ message: "Retry auth", error: "No token provider" });

  try {
    payload = await verifyToken(refreshToken, ACCESS_JWT_KEY);

    const user = await getUserByEmail(payload.email);

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

export const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logged out successfully" });
};

export const googleAuthCallback = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "No se pudo autenticar con Google" });
  }

  const refreshToken = await generateToken({ id: user.id, email: user.email }, "7d");
  const accessToken = await generateToken({ id: user.id, email: user.email }, "15m");

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // return res.status(200).json({
  //   message: "Logged successfully with Google",
  //   accessToken,
  //   data: user,
  // });
  const redirectUrl = `${FRONTEND_URL}`;

  return res.redirect(redirectUrl);
};

// export const googleAuthCallback = async (req, res) => {
//   passport.authenticate("google", (err, user) => {
//     if (err) {
//       return res.status(500).json({ message: "Error al autenticar con Google" });
//     }

//     if (!user) {
//       return res.status(401).json({ message: "No se pudo autenticar con Google" });
//     }

//     const refreshToken = generateToken({ id: user.id, email: user.email }, "7d");

//     const accessToken = generateToken({ id: user.id, email: user.email }, "15m");

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       sameSite: "None",
//       secure: process.env.NODE_ENV !== "development",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({
//       message: "Logged succesfully",
//       accessToken,
//       data: user,
//     });
//   })(req, res);
// };
