// This file contains the schema validation for the ward model
import Joi from "joi";
// Importing the ward model attributes type
import { WardData } from "../../types/ward.types";

// Defining the ward schema
export const wardValidation = (data: WardData) => {
    const wardSchema = Joi.object({
        wardName: Joi.string().required(),
        wardColor: Joi.string().required(),
    }).unknown(true); // Allowing additional properties like wardName and wardColor for fetching the ward data
    // Validating the ward data
    return wardSchema.validate(data);
};
