import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";

const pathToContactsList = path.join("db", "contacts.json");

export async function listContacts(req, res) {
  try {
    const data = await fs.readFile(pathToContactsList);
    const contactList = JSON.parse(data);
    return contactList;
  } catch (error) {
    console.log(error);
  }
}

export async function getContactById(contactId) {
  const data = await fs.readFile(pathToContactsList);
  const contactList = JSON.parse(data);
  return contactList.find((contact) => contact.id === contactId) || null;
}

export async function removeContact(contactId) {
  const data = await fs.readFile(pathToContactsList);
  const contactList = JSON.parse(data);
  const contactToRemove = contactList.find(
    (contact) => contact.id === contactId
  );
  if (!contactToRemove) {
    return null;
  }
  const newContactList = contactList.filter(
    (contact) => contact.id !== contactToRemove.id
  );
  await fs.writeFile(pathToContactsList, JSON.stringify(newContactList));
  return contactToRemove;
}

export async function addContact(name, email, phone) {
  const data = await fs.readFile(pathToContactsList);
  const contactList = JSON.parse(data);
  const newContact = { id: nanoid(), name, email, phone };
  contactList.push(newContact);
  await fs.writeFile(pathToContactsList, JSON.stringify(contactList));
  return newContact;
}

export async function updateContactById(contactId, body) {
  const data = await fs.readFile(pathToContactsList);
  const contactList = JSON.parse(data);

  const contactIndex = contactList.findIndex(
    (contact) => contactId === contact.id
  );
  if (contactIndex === -1) return null;
  contactList[contactIndex] = { ...contactList[contactIndex], ...body };

  await fs.writeFile(pathToContactsList, JSON.stringify(contactList));
  return contactList[contactIndex];
}
