// This is the authentication middleware that is used to authenticate the user and create a protected route

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

dotenv.config();

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  // If the authorization header is not provided, return a 401 error
  if (!authHeader) {
    res.status(401).json({ message: "No token provided.", error: true });
    return;
  }

  const token = authHeader.split(" ")[1];
  // If the token is not provided, return a 401 error
  if (!token) {
    res.status(401).json({ message: "Malformed token.", error: true });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(500).json({ message: "JWT secret not configured.", error: true });
    return;
  }

  // Verifying the token
  jwt.verify(token, jwtSecret, (err, userPayload) => {
    if (err) {
      res.status(403).json({ message: "Invalid token.", error: true, relogin: true });
      return;
    }
    req.user = userPayload as JwtPayload;
    next();
  });
};

export default authenticateToken;
