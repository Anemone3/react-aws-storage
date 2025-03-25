import express from "express";

import morgan from "morgan";
import cors from "cors";
import { errorHandler } from "./shared/errorHandler.js";
import PinsRouter from "./routes/pins-router.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", PinsRouter);

app.use(errorHandler);
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
