// This file contains the schema validation for the user model
import Joi from "joi";
// Importing the user model attributes type
import { LoginData, SignUpData } from "../../types/user.types";

// Defining the sign up schema
export const signUpValidation = (data: SignUpData) => {

    const userSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().required(),
    });
    
    return userSchema.validate(data);
};

// Defining the login schema
export const loginValidation = (data: LoginData) => {
    const userSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    return userSchema.validate(data);
};  

