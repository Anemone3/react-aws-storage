import { ApiError } from "../config/apiError.js";
import { prisma } from "../config/prisma.js";

export const getCollectionsByTitle = async (title) => {
  const collection = await prisma.collections.findFirst({
    where: {
      name: title,
    },
  });

  return collection;
};

export const createCollection = async (title, id, isPublic) => {
  const collection = await prisma.collections.create({
    data: {
      userId: id,
      name: title,
      isPublic,
    },
  });

  return collection;
};

export const getAllCollectionByUser = async (id) => {
  try {
    const collections = await prisma.collections.findMany({
      where: {
        userId: id,
      },
      include: {
        pins: {
          include: {
            pin: {
              include: {
                user: {
                  omit: {
                    password: true,
                    providerId: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            profileUrl: true,
            username: true,
          },
        },
      },
    });

    return collections;
  } catch (error) {
    console.log(error);
    throw new ApiError(error, 500);
  }
};

export const addPinCollectionByPinId = async (collectionId, pinId, id) => {
  const pinIdInt = parseInt(pinId, 10);
  const collectionIdInt = parseInt(collectionId, 10);

  const existingRelation = await prisma.pinsOnCollections.findUnique({
    where: {
      pinId_collectionId: { pinId: pinIdInt, collectionId: collectionIdInt },
      collection: {
        userId: id,
      },
    },
  });
  if (existingRelation) {
    if (existingRelation.userId !== String(id)) {
      throw new ApiError("El pin no pertenece a la colección de este usuario", 403);
    }
    throw new ApiError("El pin ya está agregado en la colección", 400);
  }

  const newRelation = await prisma.pinsOnCollections.create({
    data: {
      pinId: pinIdInt,
      collectionId: collectionIdInt,
      userId: id,
    },
  });

  return newRelation;
};

export const removePinToCollecionByPinId = async (collectionId, pinId, userId) => {
  try {
    const pinRelation = await prisma.pinsOnCollections.findFirst({
      where: {
        pinId,
        collectionId,
        userId, // Validación directa
      },
    });

    if (!pinRelation) {
      throw new ApiError("No tienes permiso para eliminar este pin o no existe", 403);
    }

    const pinRemove = await prisma.pinsOnCollections.delete({
      where: {
        pinId_collectionId: {
          pinId,
          collectionId,
        },
      },
    });

    return pinRemove;
  } catch (error) {
    console.log(error);
    throw new ApiError("Error to remove Pin on Collection", 500);
  }
};
