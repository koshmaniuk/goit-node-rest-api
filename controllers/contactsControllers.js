import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContactById,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  try {
    const data = await listContacts();
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getContactById(id);
    if (!data) {
      throw HttpError(404);
    }
    res.status(200).json({
      msg: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await removeContact(id);
    if (!data) {
      throw HttpError(404);
    }
    res.status(200).json({
      msg: "succes",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const { name, email, phone } = req.body;
    const data = await addContact(name, email, phone);
    res.status(201).json({
      msg: "created",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);
    const { id } = req.params;
    const data = await updateContactById(id, req.body);
    if (!data) throw HttpError(404);
    console.log(data);
    res.status(200).json({
      msg: "updated",
      data,
    });
  } catch (error) {
    next(error);
  }
};
