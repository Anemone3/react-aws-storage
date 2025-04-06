import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import { errorHandler } from "./shared/errorHandler.js";
import { AppRouter } from "./routes/index.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : process.env.CLIENT_URL_DEV,
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", AppRouter.routes);

app.use(errorHandler);
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
