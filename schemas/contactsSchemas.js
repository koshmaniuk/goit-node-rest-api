import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().min(5).max(20).required(),
  phone: Joi.string().min(5).max(15).required(),
}).options({ abortEarly: false });

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  email: Joi.string().min(5).max(20),
  phone: Joi.string().min(5).max(15),
}).min(1);
