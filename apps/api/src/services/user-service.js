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
    if(error.code === 'P2025'){
      throw ApiError('No se encontró el usuario con el email ingresado', 404);
    }
    throw error
  }
};

export const createUser = async ({
  email,
  password,
  firstname,
  lastname,
  username,
}) => {
  try {
    const exists = await prisma.users.findFirst({where:{email}})

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
    console.log(error)
    throw error;
  }
};
