import { Contact } from "../models/contactsModel.js";

export async function listContacts(req, res) {
  try {
    const contactList = Contact.find();
    return contactList;
  } catch (error) {
    console.log(error);
  }
}

export async function getContactById(contactId) {
  const contact = Contact.findById(contactId);
  return contact;
}

export async function removeContact(contactId) {
  const contactToRemove = Contact.findByIdAndDelete(contactId);
  return contactToRemove;
}

export async function addContact(name, email, phone) {
  const newContact = await Contact.create({ name, email, phone });
  return newContact;
}

export async function updateContactById(contactId, body) {
  const contactToUpdate = Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  return contactToUpdate;
}
