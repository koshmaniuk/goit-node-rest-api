import express from "express";
import {
  createUser,
  getCurrentUser,
  logoutUser,
  userLogin,
} from "../controllers/usersControllers.js";
import { protect } from "../middlewares/usersMiddlewares.js";

const usersRouter = express.Router();

usersRouter.post("/users/register", createUser);
usersRouter.post("/users/login", userLogin);
usersRouter.post("/users/logout", protect, logoutUser);
usersRouter.get("/users/current", protect, getCurrentUser);

export default usersRouter;
