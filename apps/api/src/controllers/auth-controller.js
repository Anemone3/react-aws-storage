import { createUser, getUserByEmail } from "../services/user-service.js";
import { comparePassword, hashPassword } from "../shared/bcrypt.js";
import { generateToken } from '../services/jwt-service.js'

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email) && password) {
    return res.status(400).json({ message: "El email no es válido" });
  } else if (!password || !email) {
    return res
      .status(400)
      .json({ message: "Faltan campos (email or password)" });
  }

  try {
    const { password: passwordUser, ...user } = await getUserByEmail(email);

    const isMatched = comparePassword(password, passwordUser);

    if (!isMatched)
      return res.status(400).json({ message: "Invalid Credentials" });


        
    const refreshToken = await  generateToken({id: user.id,email: user.email}, '7d')

    const accessToken = await generateToken({id: user.id,email: user.email}, '15m')

    res.cookie('refreshToken' , refreshToken, {httpOnly: true,secure: false, maxAge: 7 * 24 * 60 * 60 * 1000});

    return res.status(200).json({
      message: "Logged succesfully",
      accessToken,
      data: user,
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new ApiError("No existe una cuenta creada con este correo.", 404);
    }
  }
};

export const register = async (req, res) => {
  const { email, password, firstname, lastname } = req.body;

  if (!email || !password || !firstname || !lastname) {
    return res
      .status(400)
      .json({ message: "Faltan campos (email, password, firstname,lastname)" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "El email no es válido" });
  }

  const hashedPassword = hashPassword(password);

 try {
    const user = await createUser({email,firstname,lastname,username: `${firstname}.${lastname}`,password: hashedPassword});

    delete user.password

  
    
    const refreshToken = await  generateToken({id: user.id,email: user.email}, '7d')

    const accessToken = await  generateToken({id: user.id,email: user.email}, '15m')

    res.cookie('refreshToken' , refreshToken, {expire : new Date() + 9999});

    return res.status(200).json({
        message: 'Register succesfully',
        accessToken,
        data: user
    })
 } catch (error) {
    console.log(error);
    
 }
  
};

const validateEmail = (email) => {
  if (
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
      email
    )
  ) {
    return true;
  }
  return false;
};
