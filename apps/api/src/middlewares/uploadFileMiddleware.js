import multer, { memoryStorage, MulterError } from "multer";

export const uploadFileMiddleware = multer({
  storage: memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      const error = new MulterError("LIMIT_UNEXPECTED_FILE");
      error.message =
        "No está permitido este tipo de extensiones en el storage";
      cb(error, false);
    }
  },
});
