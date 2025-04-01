// This file contains the controller functions for the user model

import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import logger from "../utils/logger.js";
import {
  signUpValidation,
  loginValidation,
} from "../utils/schemaValidation/userValidation.js";

import User from "../Models/user.model.js";
import { NextFunction, Request, Response } from "express";

// Signing up a new user
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  logger.info("Signing up a new user");
  try {
    // Validating the request body with the schema
    const { error } = signUpValidation(req.body);
    if (error) {
      logger.warn(
        "Missing required fields for signing up: " + error.details[0].message
      );
      res.status(400).json({
        message: error.details[0].message,
        error: true,
      });
      return;
    }

    const { email, password, role } = req.body;

    // Checking if the user already exists with the given email
    const user = await User.findOne({ where: { email } });

    // If the user already exists, return a 400 error
    if (user) {
      logger.warn(
        "User already have an account with the given email. Please login" +
          email
      );
      res.status(400).json({
        message:
          "User already have an account with the given email. Please login",
        error: true,
      });
      return;
    }

    // Creating a new user with the given email, password and role (password is hased in the model)
    const newUser = await User.create({
      email,
      password,
      role,
    });

    // Removing the password from the response
    const userWithoutPassword = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    logger.info("User created successfully: " + userWithoutPassword);

    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    logger.warn("Error creating user: " + error);
    res.status(500).json({ message: "Error creating user", error: true });
  }
};

// Logging in a user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  logger.info("Logging in a user");
  try {
    // Validating the request body with the schema
    const { error } = loginValidation(req.body);
    if (error) {
      logger.warn(
        "Missing required fields for logging in: " + error.details[0].message
      );
      res.status(400).json({
        message: error.details[0].message,
        error: true,
      });
      return;
    }
    // Getting the email and password from the request body
    const { email, password } = req.body;

    // Checking if the user exists with the given email
    const user = await User.findOne({ where: { email } });

    // If the user does not exist, return a 401 error
    if (!user) {
      logger.warn("No user found with the given email: " + email);
      res.status(401).json({ message: "Invalid credentials", error: true });
      return;
    }

    // Comparing the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // If the password is incorrect, return a 401 error
    if (!isMatch) {
      logger.warn("Invalid credentials for user: " + email);
      res.status(401).json({ message: "Invalid credentials", error: true });
      return;
    }

    // Creating a token for the user
    const token = jwt.sign(
      { userId: user?.id, email: user?.email },
      (process.env.JWT_SECRET as jwt.Secret) || "default-secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "15m" } as SignOptions
    );

    // Removing the password from the response
    const userWithoutPassword = {
      id: user?.id,
      email: user?.email,
      role: user?.role,
      token: token,
    };

    // Returning the user without the password and the token
    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      error: false,
    });
  } catch (error) {
    logger.warn("Error logging in: " + error);
    res.status(500).json({ message: "Error logging in", error: true });
  }
};
