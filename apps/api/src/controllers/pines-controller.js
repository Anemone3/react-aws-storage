import { deleteFileFromS3, updloadFileToS3 } from "../services/s3-aws.js";
import { createPinService, deletePinsById, getAllPins, getPinesById } from "../services/pines-service.js";
import { ApiError } from "../config/apiError.js";
import { ACCESS_JWT_KEY } from "../config/config.js";
import { decodeToken } from "../services/jwt-service.js";
import { getUserByEmail } from "../services/user-service.js";
import { searchPhotos } from "../api/unsplashApi.js";

export const createPins = async (req, res) => {
  const file = req.file;

  const { userId } = req.params;

  const { title, description, collectionId } = req.body;

  if (!userId || !title || !description || !file) {
    throw new ApiError("Missing required fields", 400);
  }

  let keyObject;

  try {
    const { key, url } = await updloadFileToS3(file, userId);

    console.log(key);

    keyObject = key;

    const result = await createPinService({
      userId,
      title,
      description,
      imageUrl: url,
      collectionId,
    });

    res.status(200).json({
      data: result,
      message: "Success",
    });
  } catch (error) {
    if (keyObject) {
      try {
        await deleteFileFromS3(keyObject);
      } catch (error) {
        console.log(error);

        throw error;
      }
    }
    console.log(error);
    throw error;
  }
};

export const getPins = async (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "Id in params not exists or is not a number" });
  }

  const pin = await getPinesById(id);

  res.status(200).json({ data: pin });
};

export const getAllPinsController = async (req, res, next) => {
  let isUser = null;
  const authorization = req.headers["authorization"];
  const { page } = req.query;

  if (!page) throw new ApiError("Missing params", 400);

  if (authorization) {
    const token = authorization.split(" ")[1] || "";
    const payload = decodeToken(token, ACCESS_JWT_KEY);
    const userPayload = await getUserByEmail(payload.email);

    if (userPayload && userPayload.id) {
      isUser = userPayload.id;
    }
  }

  try {
    const pins = await getAllPins(isUser);

    if (!pins) {
      return res.status(404).json({ message: "Pins not found" });
    }

    let photos = await searchPhotos({ page: page, per_page: 10 });
    if (page == 1) {
      photos = pins.concat(photos);
    }

    res.status(200).json({ data: photos });
  } catch (error) {
    return res.status(500).json({ message: "Error al buscar pins", error: error.message || "Error check method" });
  }
};

export const deletePin = async (req, res) => {
  const { pinId } = req.params;

  try {
    const deleted = await deletePinsById(Number(pinId));

    return res.status(200).json({ message: "pin deleted", pin: deleted });
  } catch (error) {
    return res.status(500).json({ message: "Error to delete pin", error: error.message || "Error method DELETE pin" });
  }
};
