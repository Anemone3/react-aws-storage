import { ApiError } from "../config/apiError.js";
import { prisma } from "../config/prisma.js";

export const getUserByEmail = async (email) => {
  try {
    const user = await prisma.users.findUniqueOrThrow({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    throw new ApiError(`${!email ? "Email is undefined" : `Fail to find email ${email}`}`, 404);
  }
};

export const createUser = async ({ email, password, firstname, lastname, username }) => {
  try {
    const exists = await prisma.users.findFirst({ where: { email } });

    if (exists) throw new ApiError("Ya existe una cuenta con este correo", 400);

    const user = await prisma.users.create({
      data: {
        email,
        password,
        firstname,
        lastname,
        username,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateUserProps = async (args, userId) => {
  try {
    const exists = await prisma.users.findFirst({ where: { id: userId } });

    if (!exists) throw new ApiError("Usuario no authorizado", 401);

    const user = await prisma.users.update({
      data: {
        ...args,
      },
      where: {
        id: userId,
      },
    });

    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
};
