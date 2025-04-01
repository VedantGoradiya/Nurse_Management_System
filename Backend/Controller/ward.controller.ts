// This file contains the controller functions for the ward model

import { Request, Response } from "express";
import Ward from "../Models/ward.model.js";
import logger from "../utils/logger.js";
import { wardValidation } from "../utils/schemaValidation/wardValidation.js";
import { Op } from "sequelize";

// Controller function to create a ward
export const createWard = async (
  req: Request,
  res: Response
): Promise<void> => {
  logger.info("Creating a new ward");
  try {
    // Validating the request body with the schema
    const { error } = wardValidation(req.body);
    if (error) {
      logger.warn(
        "Missing required fields for creating a ward: " +
          error.details[0].message
      );
      res.status(400).json({
        message: error.details[0].message,
        error: true,
      });
      return;
    }
    // Getting the required fields from the request body
    const { wardName, wardColor } = req.body;

    // Checking if the ward already exists with the same name and color 
    const ward = await Ward.findOne({ where: { [Op.and]: [{wardName}, {wardColor}] } });

    // if (ward && ward.wardColor === wardColor) {
    //If the ward already exists with the same name and color, return a 400 error
    if (ward) {
      logger.warn("Ward already exists with the same name and color");
      res.status(400).json({
        message: "Ward already exists",
        error: true,
      });
      return;
    }

    // Creating a list of allowed ward colors
    const allowedWardColor = ["Red", "Green", "Blue", "Yellow"];

    // Checking if the ward color is allowed
    if (
      !allowedWardColor
        .map((color) => color.toLowerCase())
        .includes(wardColor.toLowerCase())
    ) {
      logger.warn("Invalid ward color selected: " + wardColor);
      res.status(400).json({
        message:
          "Please select a color from either Red, Green, Blue, or Yellow",
        error: true,
      });
      return;
    }

    // Creating a new Ward record
    const newWard = await Ward.create({
      wardName,
      wardColor,
    });

    // Sending a successful response with the new ward
    res.status(201).json({
      message: "Ward created successfully!",
      ward: newWard,
    });
  } catch (error) {
    logger.warn("Error creating ward:", error);
    res.status(500).json({ message: "Error creating ward", error });
  }
};

// Deleting a ward by ID
export const deleteWard = async (req: Request, res: Response) => {
  logger.info("Deleting a ward");
  try {
    // Getting the ward ID from the request params
    const { id } = req.params;
    // Finding the ward with the given ID
    const ward = await Ward.findByPk(id);
    // If the ward is not found, return a 404 error
    if (!ward) {
      logger.warn("Ward not found with ID: " + id);
      res.status(404).json({ message: "Ward not found", error: true });
      return;
    }

    await ward.destroy();
    logger.info("Ward deleted successfully with ID: " + id);
    res
      .status(200)
      .json({ message: "Ward deleted successfully", error: false });
  } catch (error) {
    logger.warn("Error deleting ward:", error);
    res.status(500).json({ message: "Error deleting ward", error: true });
  }
};

// Getting all the wards
export const getAllWards = async (
  req: Request,
  res: Response
): Promise<void> => {
  logger.info("Getting all wards");
  try {
    // Getting all the wards
    const wards = await Ward.findAll();
    // Sending a successful response with the wards
    res.status(200).json(wards);
  } catch (error) {
    logger.warn("Error fetching wards:", error);
    res.status(500).json({ message: "Error fetching wards", error: true });
  }
};

// Creating multiple wards
export const createManyWards = async (req: Request, res: Response) => {
  logger.info("Creating multiple wards");
  try {
    // Getting the wards from the request body
    const wards = req.body;
    // Creating the wards
    const createdWards = await Ward.bulkCreate(wards);
    // Sending a successful response with the created wards
    logger.info("Wards created successfully");
    res.status(201).json({
      message: "Wards created successfully",
      wards: createdWards,
    });
  } catch (error) { 
    logger.warn("Error creating wards:", error);
    res.status(500).json({
      message: "Error creating wards",
      error: true,
    });
  }
};
