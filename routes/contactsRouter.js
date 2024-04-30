import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import { checkContactId } from "../middlewares/contactMiddlewares.js";
import { protect } from "../middlewares/usersMiddlewares.js";

const contactsRouter = express.Router();

contactsRouter.get("/", protect, getAllContacts);

contactsRouter.get("/:id", protect, checkContactId, getOneContact);

contactsRouter.delete("/:id", protect, checkContactId, deleteContact);

contactsRouter.post("/", protect, createContact);

contactsRouter.put("/:id", protect, checkContactId, updateContact);

contactsRouter.patch(
  "/:id/favorite",
  protect,
  checkContactId,
  updateStatusContact
);

export default contactsRouter;
