import { Types } from "mongoose";
import HttpError from "../helpers/HttpError.js";

export const checkContactId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idIsValid = Types.ObjectId.isValid(id);
    if (!idIsValid) throw HttpError(404);
    next();
  } catch (error) {
    next(error);
  }
};
