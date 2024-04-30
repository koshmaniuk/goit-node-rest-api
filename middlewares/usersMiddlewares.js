import HttpError from "../helpers/HttpError.js";
import { checkToken } from "../services/jwtServices.js";
import { getUserById } from "../services/usersServices.js";

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
