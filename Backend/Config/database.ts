//This file is used to connect to the database (PostgreSQL with Sequelize ORM)

import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
import logger from "../utils/logger.js";

// Database connection using Sequelize ORM and creating a connection instance
const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST as string,
    dialect: "postgres",
    logging: false,
  }
);

// Check if the connection is successful
sequelize
  .authenticate()
  .then(() => {
    logger.info("Connected to local PostgreSQL database successfully!");
  })
  .catch((error) => {
    logger.error("Unable to connect to the database:", error);
  });

export default sequelize