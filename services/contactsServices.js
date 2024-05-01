import { Contact } from "../models/contactsModel.js";

export async function listContacts(owner) {
  const contactList = Contact.find({ owner });
  return contactList;
}

export async function getContactById(contactId, ownerId) {
  const contact = Contact.findOne({ _id: contactId, owner: ownerId });
  return contact;
}

export async function removeContact(contactId, ownerId) {
  const contactToRemove = Contact.findOneAndDelete({
    _id: contactId,
    owner: ownerId,
  });
  return contactToRemove;
}

export async function addContact(owner, name, email, phone) {
  const newContact = await Contact.create({ name, email, phone, owner });
  return newContact;
}

export async function updateContactById(contactId, body, ownerId) {
  const contactToUpdate = Contact.findOneAndUpdate(
    { _id: contactId, owner: ownerId },
    body,
    {
      new: true,
    }
  );
  return contactToUpdate;
}
