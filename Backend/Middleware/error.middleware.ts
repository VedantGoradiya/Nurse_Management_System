// This is the error middleware that is used to handle errors in the application

import logger from "../utils/logger.js";
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.stack);
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: true });
};
    
