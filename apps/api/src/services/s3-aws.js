import {
  AWS_ACCESS_KEY,
  AWS_BUCKET_NAME,
  AWS_REGION,
  AWS_SECRET_KEY,
  CDN_URL,
} from "../config/config.js";
import crypto from "crypto";
import {
  S3Client as S3,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const S3Client = new S3({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

export const updloadFileToS3 = async (file, userId) => {
  const shortId = crypto.randomBytes(8).toString("hex");

  const key = `${userId}/${shortId}-${file.originalname}`;

  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);

    await S3Client.send(command);

    return {
      key: key,
      url: `${CDN_URL}/${key}`,
    };
  } catch (error) {
    console.log(error);
    throw new Error("No se pudo subir el archivo");
  }
};

export const deleteFileFromS3 = async (fileName) => {
  try {
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: fileName,
    };
    await S3Client.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.error("Error al eliminar el archivo de S3:", error);
    throw new Error("No se pudo eliminar el archivo de S3");
  }
};
