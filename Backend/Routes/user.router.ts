// This file contains the routes for the user model
import express, { Router } from "express";
import { signUp, login } from "../Controller/user.controller.js";

const router: Router = express.Router();

//Post route to sign up a user
router.post("/signup", signUp);

//Post route to login a user
router.post("/login", login);

export default router;