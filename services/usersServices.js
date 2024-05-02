import { User } from "../models/usersModel.js";

export async function addUser(email, password, avatarURL) {
  const newUser = await User.create({ email, password, avatarURL });
  return newUser;
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
