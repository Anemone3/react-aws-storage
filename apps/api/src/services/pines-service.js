import { ApiError } from "../config/apiError.js";
import { prisma } from "../config/prisma.js";

export const createPinService = async ({ userId, title, description, imageUrl, collectionId }) => {
  try {
    const pin = await prisma.pins.create({
      data: {
        userId,
        title,
        description,
        imageUrl,
        link: imageUrl,
        collections: collectionId
          ? {
              create: [{ collection: { connect: { id: Number(collectionId) } } }],
            }
          : undefined,
      },
      include: {
        collections: true,
        user: {
          omit: { password: true },
        },
      },
    });

    return pin;
  } catch (error) {
    console.log(error);
    if (error.code === "P2025") {
      throw new ApiError("ID de colección no válido o inexistente.", 404);
    }

    throw new ApiError("Check console log, post/create-pin", 500);
  }
};

export const getPinesById = async (id) => {
  try {
    const pin = await prisma.pins.findUniqueOrThrow({
      where: {
        id: Number(id),
      },
    });

    return pin;
  } catch (error) {
    if (error.code === "P2025") {
      throw new ApiError("ID de pin no válido o inexistente.", 404);
    }
    throw new Error(error);
  }
};

export const getAllPins = async (userId = null) => {
  try {
    console.log("userid", userId);

    const pins = await prisma.pins.findMany({
      include: {
        user: {
          omit: { password: true },
        },
        collections: userId
          ? {
              where: {
                collection: {
                  userId: userId,
                },
              },
              select: {
                collectionId: true,
              },
            }
          : false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const pinsWithIsSaved = pins.map((pin) => ({
      ...pin,
      isSaved: pin.collections && pin.collections.length > 0,
    }));

    return pinsWithIsSaved;
  } catch (error) {
    throw new Error(error);
  }
};
