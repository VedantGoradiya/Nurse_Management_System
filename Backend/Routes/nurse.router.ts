// This file contains the routes for the nurse model

import express from "express";
import {
  createNurse,
  getAllNurses,
  getNurseById,
  updateNurse,
  deleteNurse,
  filterNurses,
  createManyNurses,
} from "../Controller/nurse.controller.js";
//Importing the authentication middleware to protect the routes
import authenticateToken from "../Middleware/auth.middleware.js";

const router = express.Router();

//Post route to create a nurse
router.post("/nurses", authenticateToken, createNurse);

//Get routes to get all nurses
router.get("/nurses", authenticateToken, getAllNurses);
//Get route to get a nurse by ID
router.get("/nurses/:id", authenticateToken, getNurseById);
//Put route to update a nurse by ID
router.put("/nurses/:id", authenticateToken, updateNurse);
//Delete route to delete a nurse by ID
router.delete("/nurses/:id", authenticateToken, deleteNurse);
//Get route to filter nurses
router.get("/filter", authenticateToken, filterNurses);
//Post route to create multiple nurses
router.post("/nurses/bulk", authenticateToken, createManyNurses);

export default router;
