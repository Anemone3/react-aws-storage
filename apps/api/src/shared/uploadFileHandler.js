import { MulterError } from "multer";

export const multerErrorHandler = (middleware) => {
  return (req, res, next) => {
    middleware(req, res, (err) => {
      if (err) {
        if (err instanceof MulterError) {
          return res.status(400).json({
            message: "Error al subir el archivo",
            error: err.message,
          });
        }

        if (!req.file) {
          return res.status(400).json({
            message: "No file uploaded",
            error: "No se subió ningún archivo",
          });
        }

        return res.status(500).json({
          message: "Error al subir el archivo",
          error: "Hubo un problema con el storage del archivo",
        });
      }
      next();
    });
  };
};
