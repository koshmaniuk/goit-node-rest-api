import path from "path";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import Jimp from "jimp";
import fs from "fs/promises";
import { nanoid } from "nanoid";

import HttpError from "../helpers/HttpError.js";
import {
  createUserSchema,
  userLoginSchema,
  verifyUserSchema,
} from "../schemas/usersSchemas.js";
import { signToken } from "../services/jwtServices.js";
import {
  addUser,
  checkUser,
  checkUserExists,
  login,
  sendVerificationEmail,
  updateAvatarUrl,
  updateUser,
  verifyEmail,
} from "../services/usersServices.js";

export const createUser = async (req, res, next) => {
  try {
    const { value, error } = createUserSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const userExists = await checkUserExists({ email: value.email });
    if (userExists) throw HttpError(409, "Email in use");

    const { email, password } = value;

    const avatarURL = gravatar.url(
      email,
      { s: "300", r: "x", d: "robohash" },
      true
    );

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const verificationToken = nanoid();
    const newUser = await addUser(
      email,
      passwordHash,
      avatarURL,
      verificationToken
    );

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await checkUserExists({ verificationToken });
    if (!user) throw HttpError(404, "User not found");
    await verifyEmail({ verificationToken });

    res.status(200).json({ message: "Verification successful" });
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

    console.log(userToCheck);

    const isPasswordValid = await bcrypt.compare(
      password,
      userToCheck.password
    );
    if (!isPasswordValid) throw HttpError(401, "Email or password is wrong");
    if (!userToCheck.verify) throw HttpError(403, "please verify your email");

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
    await updateUser({ _id }, { token: "" });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw HttpError(400, "File is required");

    const { _id } = req.user;
    const { path: avatarPath, filename } = req.file;

    const avatar = await Jimp.read(avatarPath);
    await avatar.resize(250, 250).writeAsync(avatarPath);

    const newAvatarPath = path.join("public", "avatars", filename);
    await fs.rename(avatarPath, newAvatarPath);

    await updateAvatarUrl({ _id }, { avatarURL: `/avatars/${filename}` });

    res.status(200).json({ avatarURL: `/avatars/${filename}` });
  } catch (error) {
    next(error);
  }
};

export const reVerefication = async (req, res, next) => {
  try {
    const { value, error } = verifyUserSchema.validate(req.body);
    if (error) throw HttpError(400, "missing required field email");
    const { email } = value;

    const user = await checkUser(email);
    const { verificationToken } = user;
    if (!verificationToken)
      throw HttpError(400, "Verification has already been passed");

    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
