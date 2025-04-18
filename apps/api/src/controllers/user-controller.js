import { updloadFileToS3 } from "../services/s3-aws.js";
import { updateUserProps } from "../services/user-service.js";

export const updateUserData = async (req, res, next) => {
  const file = req.file;

  const userId = req.user?.id;

  const { firstname, lastname, email, password } = req.body;

  try {
    const formValues = { firstname, lastname, email, password };

    //TODO: Mejorar esto, para evitar cambiar datos a vacios, o repetir cambiar a los que no se modifican
    let objectToUpdate = {};

    for (const key in formValues) {
      const value = formValues[key];
      if (typeof value === "string" && value !== undefined && value.length > 3) {
        objectToUpdate[key] = value;
      }
    }

    if (file) {
      const fileUrl = await updloadFileToS3(file, "public");

      if (!fileUrl) return res.status(404).json({ message: "No se pudo crear la imagen, retry" });

      objectToUpdate["profileUrl"] = fileUrl.url;
    }

    const user = await updateUserProps(objectToUpdate, userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
