// This file contains the routes for the ward model
import express from 'express';
import { createWard, getAllWards, deleteWard, createManyWards } from '../Controller/ward.controller.js'; 
//Importing the authentication middleware to protect the routes
import authMiddleware from '../Middleware/auth.middleware.js';

const router = express.Router();

//Post route to create a ward
router.post('/wards', authMiddleware, createWard);

//Get route to get all wards
router.get('/wards', authMiddleware, getAllWards);

//Delete route to delete a ward by ID
router.delete('/wards/:id', authMiddleware, deleteWard);

//Post route to create multiple wards
router.post('/wards/bulk', authMiddleware, createManyWards);

export default router;
