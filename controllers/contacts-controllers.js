import { Contact } from '../models/Contacts.js';
import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';

export const getListContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.params;
  const result = await Contact.find(owner);
  res.json(result);
};

export const getById = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;

  console.log('_id', _id);
  console.log(', owner', owner);

  const result = await Contact.findOne({ _id, owner });

  if (!result) {

    // ось так не працбє
    throw HttpError(404, `Contact with ${_id} not found`);

    //а так все добре
    // res.status(401).json("Contact not found");

  }
   
  res.json(result);
};

export const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

export const update = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate({ _id, owner }, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id=${_id} not found`);
  }
  res.json(result);
};

export const updateStatusContact = async (req, res) => {
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

export const remove = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndDelete({
    _id,
    owner,
  });
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
  delete: ctrlWrapper(remove),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
