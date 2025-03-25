import { deleteFileFromS3, updloadFileToS3 } from "../services/s3-aws.js";
import { createPinService } from "../services/pines-service.js";
import { ApiError } from "../config/apiError.js";

export const createPins = async (req, res) => {
  const file = req.file;

  const { userId } = req.params;

  const { title, description } = req.body;

  if (!userId || !title || !description || !file) {
    throw new ApiError("Missing required fields", 400);
  }

  let keyObject;

  try {
    const { key, url } = await updloadFileToS3(file,userId);

    console.log(key);
    
    keyObject = key;

    const result = await createPinService({
      userId,
      title,
      description,
      imageUrl: url,
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
        throw error;
      }
    }
    throw error;
  }
};

export const getPins = async (req, res, next) => {
  res.status(200).json({ message: "pins " });
};
