import { ApiError } from "../config/apiError.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err instanceof ApiError ? err.status : 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};
