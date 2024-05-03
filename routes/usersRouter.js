import express from "express";
import {
  createUser,
  getCurrentUser,
  logoutUser,
  updateAvatar,
  userLogin,
} from "../controllers/usersControllers.js";
import { protect, uploadAvatar } from "../middlewares/usersMiddlewares.js";

const usersRouter = express.Router();

usersRouter.post("/register", createUser);
usersRouter.post("/login", userLogin);
usersRouter.post("/logout", protect, logoutUser);
usersRouter.get("/current", protect, getCurrentUser);
usersRouter.patch("/avatars", protect, uploadAvatar, updateAvatar);

export default usersRouter;
