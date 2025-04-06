import { deleteFileFromS3, updloadFileToS3 } from "../services/s3-aws.js";
import {
  createPinService,
  getAllPins,
  getPinesById,
} from "../services/pines-service.js";
import { ApiError } from "../config/apiError.js";

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
    return res
      .status(400)
      .json({ message: "Id in params not exists or is not a number" });
  }

  const pin = await getPinesById(id);

  res.status(200).json({ data: pin });
};

export const getAllPinsController = async (req, res, next) => {
  const pins = await getAllPins();

  if (!pins) {
    return res.status(404).json({ message: "Pins not found" });
  }

  res.status(200).json({ data: pins });
};
