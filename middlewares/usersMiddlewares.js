import multer from "multer";
import path from "path";
import HttpError from "../helpers/HttpError.js";
import { checkToken } from "../services/jwtServices.js";
import { getUserById } from "../services/usersServices.js";
import { nanoid } from "nanoid";

export const protect = async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer ") &&
    req.headers.authorization.split(" ")[1];
  try {
    const userId = checkToken(token);
    if (!userId) throw HttpError(401, "Not authorized");

    const currentUser = await getUserById(userId);

    if (!currentUser) throw HttpError(401, "Not authorized");
    if (!currentUser.token) throw HttpError(401, "Not authorized");
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.dirname("tmp"));
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    cb(null, `${req.user._id}.${extension}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new HttpError(400, "Please upload images only"), false);
  }
};
export const uploadAvatar = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
}).single("avatar");
