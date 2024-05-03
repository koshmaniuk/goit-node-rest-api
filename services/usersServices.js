import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

import { User } from "../models/usersModel.js";

export async function addUser(email, password, avatarURL, verificationToken) {
  const newUser = await User.create({
    email,
    password,
    avatarURL,
    verificationToken,
  });
  return newUser;
}

export async function verifyEmail(filter) {
  const update = { verify: true, verificationToken: null };
  await User.findOneAndUpdate(filter, update);
  return;
}

export async function checkUser(email) {
  const user = await User.findOne({ email });
  return user;
}

export async function login(id, newToken) {
  const update = { token: newToken };
  const options = {
    projection: { password: 0, _id: 0, token: 0, createdAt: 0, updatedAt: 0 },
  };
  const updatedUser = await User.findByIdAndUpdate(id, update, options);
  return updatedUser;
}

export async function updateUser(id, token) {
  await User.findByIdAndUpdate(id, token);
  return;
}

export async function getUserById(id) {
  const user = User.findById(id);
  return user;
}

export async function updateAvatarUrl(id, avatarURL) {
  await User.findByIdAndUpdate(id, avatarURL);
  return;
}

export const checkUserExists = (filter) => User.exists(filter);

export async function sendVerificationEmail(email, verificationToken) {
  const emailTransport = nodemailer.createTransport({
    host: process.env.UKRNET_HOST,
    port: process.env.UKRNET_PORT,
    secure: true,
    auth: {
      user: process.env.UKRNET_USER,
      pass: process.env.UKRNET_PASS,
    },
  });

  const emailConfig = {
    from: process.env.UKRNET_USER,
    to: email,
    subject: "Verification email",
    text: `Verification link: /users/verify/${verificationToken}`,
  };

  await emailTransport.sendMail(emailConfig);
}
