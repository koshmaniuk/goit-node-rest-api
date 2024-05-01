import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} from "../schemas/contactsSchemas.js";
import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContactById,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  const { _id: owner } = await req.user;
  try {
    const data = await listContacts(owner);
    res.json(data);
  } catch (error) {
    console.log(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { _id: ownerId } = await req.user;
  try {
    const { id } = req.params;
    const data = await getContactById(id, ownerId);
    if (!data) {
      throw HttpError(404);
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { _id: ownerId } = await req.user;
  try {
    const { id } = req.params;
    const data = await removeContact(id, ownerId);
    if (!data) {
      throw HttpError(404);
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { _id: owner } = await req.user;
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);
    const { name, email, phone } = req.body;
    const data = await addContact(owner, name, email, phone);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { _id: ownerId } = await req.user;
  try {
    if (Object.keys(req.body).length === 0)
      throw HttpError(400, "Body must have at least one field");
    const { error } = updateContactSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);
    const { id } = req.params;
    const data = await updateContactById(id, req.body, ownerId);
    if (!data) throw HttpError(404);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  const { _id: ownerId } = await req.user;
  try {
    if (!Object.keys(req.body).includes("favorite"))
      throw HttpError(400, "No 'favorite' field");
    const { error } = updateContactStatusSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);
    const { id } = req.params;
    const data = await updateContactById(id, req.body, ownerId);
    if (!data) throw HttpError(404);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
