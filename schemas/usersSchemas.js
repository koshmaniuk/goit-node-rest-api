import Joi from "joi";

export const createUserSchema = Joi.object({
  email: Joi.string().min(5).max(20).required(),
  password: Joi.string().min(5).max(15).required(),
}).options({ abortEarly: false });

export const userLoginSchema = Joi.object({
  email: Joi.string().min(5).max(20).required(),
  password: Joi.string().required(),
}).options({ abortEarly: false });

export const verifyUserSchema = Joi.object({
  email: Joi.string().min(5).max(20).email().required(),
});
