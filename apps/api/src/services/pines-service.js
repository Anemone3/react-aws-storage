import { ApiError } from "../config/apiError.js";
import { prisma } from "../config/prisma.js";

export const createPinService = async ({
  userId,
  title,
  description,
  imageUrl,
}) => {
  try {
    const pin = await prisma.pins.create({
      data: {
        userId,
        title,
        description,
        imageUrl,
        link: imageUrl,
      },
    });
    return pin;
  } catch (error) {
    console.log(error);
    throw new ApiError("Error creating pin", 500);
  }
};
