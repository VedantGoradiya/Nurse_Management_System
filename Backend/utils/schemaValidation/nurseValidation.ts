// This file contains the schema validation for the nurse model
import Joi from "joi";
// Importing the nurse model attributes type
import { NurseModelAttributes } from "../../types/nurse.types";
// Defining the nurse interface
interface Nurse extends NurseModelAttributes {
  [key: string]: any; // For unknown properties
}

export const nurseValidation = (
  data: Nurse
): Joi.ValidationResult<Nurse> => {
  // Defining the nurse schema
  const nurseSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    wardId: Joi.number().required(),
  }).unknown(true); // Allowing additional properties like wardName and wardColor for fetching the ward data

  // Validating the nurse data
  return nurseSchema.validate(data);
};  
