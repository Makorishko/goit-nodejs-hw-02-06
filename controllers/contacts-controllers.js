import { Contact } from '../models/Contacts.js';
import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import fs from 'fs/promises';
import path from 'path';

const avatarPath = path.resolve('public', 'avatars');

const getListContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.find(owner);
  res.json(result);
};

const getById = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOne({ _id, owner });
  if (!result) {
    throw HttpError(404, `Contact with id=${_id} not found`);
  }
  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);
  await fs.rename(oldPath, newPath);
  const avatar = path.join('avatars', filename);

  const result = await Contact.create({ ...req.body,avatar, owner });
  res.status(201).json(result);
};

const update = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate({ _id, owner }, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id=${_id} not found`);
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate(
    {
      _id,
      owner,
    },
    req.body,
  );
  if (!result) {
    throw HttpError(404, `Contact with id=${_id} not found`);
  }
  res.json(result);
};

const remove = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndDelete({ _id, owner });
  if (!result) {
    throw HttpError(404, `Contact with id=${_id} not found`);
  }
  res.json({ message: 'Contact is deleted' });
};

export default {
  getListContacts: ctrlWrapper(getListContacts),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  update: ctrlWrapper(update),
  remove: ctrlWrapper(remove),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
