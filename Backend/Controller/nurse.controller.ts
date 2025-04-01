// This file contains the controller functions for the nurse model

import { Op, WhereOptions } from "sequelize";
import { Request, Response } from "express";
import { Nurse, Ward } from "../Models/index.js";
import logger from "../utils/logger.js";
import { nurseValidation } from "../utils/schemaValidation/nurseValidation.js";

import { NurseModelAttributes } from "../types/nurse.types";

//Creating a new nurse
export const createNurse = async (
  req: Request,
  res: Response
): Promise<void> => {
  logger.info("Creating a new nurse");
  try {
    //Validating the request body with the schema
    const { error } = nurseValidation(req.body);
    if (error) {
      logger.warn(
        "Missing required fields for creating a nurse: " +
          error.details[0].message
      );
      res.status(400).json({
        message: error.details[0].message,
        error: true,
      });
      return;
    }
    //Extracting the required fields from the request body
    const { firstName, lastName, email, wardId } = req.body;

    // Checking if the ward exists with the given wardId
    const ward = await Ward.findByPk(wardId);
    if (!ward) {
      logger.warn("Ward not found with ID: " + wardId);
      res.status(404).json({ message: "Ward not found!", error: true });
      return;
    }

    // Checking if the nurse already exists with the given email
    const nurse = await Nurse.findOne({ where: { email } });

    if (nurse) {
      logger.warn("Nurse with this email already exist: " + email);
      res.status(404).json({
        message: "Nurse with this email already exist",
        error: true,
      });
      return;
    }

    // Creating a new Nurse record
    const newNurse = await Nurse.create({
      firstName,
      lastName,
      email,
      wardId,
    });
    logger.info("Nurse created successfully with ID: " + newNurse.employeeId);

    // Fetching the nurse with the ward details using the employeeId
    const nurseWithWard = await Nurse.findByPk(newNurse.employeeId, {
      include: [{ model: Ward, as: "ward" }],
    });

    // Sending a successful response with the nurse details
    res.status(201).json({
      message: "Nurse created successfully!",
      nurse: nurseWithWard,
    });
  } catch (error) {
    logger.warn("Error creating nurse:", error);
    res.status(500).json({
      message: "Error creating nurse",
      error: true,
    });
  }
};

// Getting all nurses with their ward details with pagination
export const getAllNurses = async (
  req: Request,
  res: Response
): Promise<void> => {
  logger.info("Getting all nurses");
  try {
    // Getting all nurses and the ward details
    const nurses = await Nurse.findAll({
      include: [
        { model: Ward, as: "ward", attributes: ["wardName", "wardColor"] },
      ],
    });
    logger.info("All nurses fetched successfully");

    res.status(200).json(nurses);
  } catch (error) {
    logger.warn("Error fetching nurses:", error);
    res.status(500).json({
      message: "Error fetching nurses",
      error: true,
    });
  }
};

// Getting a nurse by ID with their ward details
export const getNurseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  logger.info("Getting a nurse by ID");
  try {
    // Getting ID from the request parameters
    const { id } = req.params;

    // Getting the nurse by ID and the ward details
    const nurse = await Nurse.findByPk(id, {
      include: [{ model: Ward, as: "ward" }],
    });

    // Checking if the nurse exists with the given ID
    if (!nurse) {
      logger.warn("Nurse not found with ID: " + id);
      res.status(404).json({ message: "Nurse not found!", error: true });
      return;
    }

    res.status(200).json(nurse);
  } catch (error) {
    logger.warn("Error fetching nurse:", error);
    res.status(500).json({
      message: "Error fetching nurse",
      error: true,
    });
  }
};

// Updating a nurse by ID
export const updateNurse = async (
  req: Request,
  res: Response
): Promise<void> => {
  logger.info("Updating a nurse");
  try {
    //Validating the request body with the schema
    const { error } = nurseValidation(req.body);
    if (error) {
      logger.warn(
        "Missing required fields for updating a nurse: " +
          error.details[0].message
      );
      res.status(400).json({
        message: error.details[0].message,
        error: true,
      });
      return;
    }

    // Getting ID from the request parameters
    const { id } = req.params;
    const { firstName, lastName, email, wardId } = req.body;

    // Getting the nurse by ID
    const nurse = await Nurse.findByPk(id);
    // Checking if the nurse exists with the given ID
    if (!nurse) {
      logger.warn("Nurse not found with ID: " + id);
      res.status(404).json({ message: "Nurse not found!", error: true });
      return;
    }

    // Checking if the ward exists based on the wardId
    if (wardId) {
      const ward = await Ward.findByPk(wardId);
      if (!ward) {
        logger.warn("Ward not found with ID: " + wardId);
        res.status(404).json({ message: "Ward not found!", error: true });
        return;
      }
    }

    // Updating the nurse with the given ID and the required fields
    await nurse.update({ firstName, lastName, email, wardId });
    logger.info(
      "Nurse updated successfully with ID: " + id + " and email: " + email
    );

    // Fetching the updated nurse along with the ward details
    const updatedNurse = await Nurse.findByPk(id, {
      include: [{ model: Ward, as: "ward" }],
    });

    res.status(200).json({
      message: "Nurse updated successfully!",
      nurse: updatedNurse,
    });
  } catch (error) {
    logger.warn("Error updating nurse:", error);
    res.status(500).json({
      message: "Error updating nurse",
      error: true,
    });
  }
};

// Deleting a nurse by ID
export const deleteNurse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Getting ID from the request parameters
    const { id } = req.params;

    // Getting the nurse by ID
    const nurse = await Nurse.findByPk(id);

    // Checking if the nurse exists with the given ID
    if (!nurse) {
      logger.warn("Nurse not found with ID: " + id);
      res.status(404).json({ message: "Nurse not found!", error: true });
      return;
    }

    // Deleting the nurse with the given ID
    await nurse.destroy();
    logger.info("Nurse deleted successfully with ID: " + id);
    res.status(200).json({ message: "Nurse deleted successfully!", nurse });
  } catch (error) {
    logger.warn("Error deleting nurse:", error);
    res.status(500).json({
      message: "Error deleting nurse",
      error: true,
    });
  }
};

// Filtering nurses with pagination and searching by full name and ward name
export const filterNurses = async (
  req: Request,
  res: Response
): Promise<void> => {
  logger.info("Filtering nurses");
  try {
    // Extracting query params for pagination and search
    let { page = 1, limit = 10, fullName, wardName } = req.query;
    page = parseInt(page as string, 10);
    limit = parseInt(limit as string, 10);
    const offset = (page - 1) * limit;

    // Creating a where condition for the nurses
    const whereCondition: WhereOptions<NurseModelAttributes> = {};
    // Creating a where condition for the wards
    const wardWhereCondition: WhereOptions<{ wardName: string }> = {};

    // Searching for nurses by full name by either firstName or lastName
    if (fullName) {
      (whereCondition as any)[Op.or] = [
        { firstName: { [Op.iLike]: `%${fullName}%` } },
        { lastName: { [Op.iLike]: `%${fullName}%` } },
      ];
    }

    // Searching for wards by wardName only if the wardName is provided
    if (wardName) {
      wardWhereCondition.wardName = { [Op.iLike]: `%${wardName}%` };
    }

    // Fetching nurses with pagination and above created where conditions
    const { count, rows } = await Nurse.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: Ward,
          as: "ward",
          attributes: ["id", "wardName", "wardColor"],
          where: Object.keys(wardWhereCondition).length
            ? wardWhereCondition
            : undefined,
          required: !!wardName,
        },
      ],
      limit,
      offset,
      order: [["employeeId", "ASC"]],
    });

    // Returning the paginated response with the total records, total pages, current page and the nurses found
    res.json({
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      nurses: rows,
    });
  } catch (error) {
    logger.warn("Error fetching nurses:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: true,
    });
  }
};

// Creating multiple nurses
export const createManyNurses = async (
  req: Request,
  res: Response
): Promise<void> => {
  logger.info("Creating multiple nurses");
  try {
    const nurses = req.body;
    const createdNurses = await Nurse.bulkCreate(nurses);
    logger.info("Nurses created successfully");
    res.status(201).json({
      message: "Nurses created successfully",
      nurses: createdNurses,
    });
  } catch (error) {
    logger.warn("Error creating nurses:", error);
    res.status(500).json({
      message: "Error creating nurses",
      error: true,
    });
  }
};
