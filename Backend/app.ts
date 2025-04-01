import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import sequelize from "./Config/database.js";
import userRoutes from "./Routes/user.router.js";
import wardRoutes from "./Routes/ward.router.js";
import nurseRoutes from "./Routes/nurse.router.js";
import { errorHandler } from "./Middleware/error.middleware.js";
import logger from "./utils/logger.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());

sequelize
  .sync({ alter: true })
  .then(() => {
    logger.info("Database synced successfully.");
  })
  .catch((err) => {
    logger.error("Unable to sync database:", err);
  });

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${JSON.stringify(req.body)}`);
  next();
});

app.use("/auth", userRoutes);
app.use("/api", wardRoutes);
app.use("/api", nurseRoutes);
app.get("/poll", (req, res) => {
  res.send("Hello World");
});

app.use(errorHandler);

app.use("*", (req, res) => {
  res.status(404).json({ message: "No route found", error: true });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});
