import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const contactsPath = path.resolve('models', 'contacts.json');
console.log();

const updateContacts = (contacts) => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export async function listContacts() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

export async function getContactById(id) {
  const contacts = await listContacts();
  const result = contacts.find((item) => item.id === id);
  return result || null;
}

export async function removeContact(id) {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await updateContacts(contacts);
  return result;
}

export async function addContact(body) {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), ...(body || {}) };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

export async function updateContact(id, body) {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  contacts[index] = { ...contacts[index], ...body };
  await updateContacts(contacts);
  return contacts[index];
}

// const listContacts = async () => {};

// const getContactById = async (contactId) => {};

// const removeContact = async (contactId) => {};

// const addContact = async (body) => {};

// const updateContact = async (contactId, body) => {};

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
