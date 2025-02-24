import Joi from "joi";

export const gadgetSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  status: Joi.string()
    .valid("Available", "Deployed", "Destroyed", "Decommissioned")
    .required(),
});
