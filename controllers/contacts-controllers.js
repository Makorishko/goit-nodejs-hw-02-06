import { Contact } from '../models/Contacts.js';
import HttpError from '../helpers/HttpError.js';
import { ctrlWrapper } from '../decorators/index.js';

export const getListContacts = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};

export const getById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  res.json(result);
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
};

export const add = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

export const update = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json(result);
};

export const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json(result);
};

export const remove = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json({ message: 'Contact is deleted' });
};

export default {
  getListContacts: ctrlWrapper(getListContacts),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  update: ctrlWrapper(update),
  delete: ctrlWrapper(remove),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
