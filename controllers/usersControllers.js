import bcrypt from "bcrypt";

import HttpError from "../helpers/HttpError.js";
import { createUserSchema, userLoginSchema } from "../schemas/usersSchemas.js";
import { signToken } from "../services/jwtServices.js";
import {
  addUser,
  checkUser,
  checkUserExists,
  login,
  updateUser,
} from "../services/usersServices.js";

export const createUser = async (req, res, next) => {
  try {
    const { value, error } = createUserSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const userExists = await checkUserExists({ email: value.email });
    if (userExists) throw HttpError(409, "Email in use");

    const { email, password } = value;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await addUser(email, passwordHash);
    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { value, error } = userLoginSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const { email, password } = value;

    const userToCheck = await checkUser(email);
    if (!userToCheck) throw HttpError(401, "Email or password is wrong");

    const isPasswordValid = await bcrypt.compare(
      password,
      userToCheck.password
    );
    if (!isPasswordValid) throw HttpError(401, "Email or password is wrong");

    const token = signToken(userToCheck._id);
    const user = await login(userToCheck._id, token);
    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res) => {
  const user = await req.user;
  if (!user) throw HttpError(401, "Not authorized");
  const { email, subscription } = user;
  res.status(200).json({ email, subscription });
};

export const logoutUser = async (req, res, next) => {
  try {
    const { _id } = await req.user;
    await updateUser({ _id }, { token: "null" });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
