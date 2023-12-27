import * as contactModel from '../models/contacts.js';
import HttpError from '../helpers/HttpError.js';
import { contactAddSchema, contactUpdateSchema } from '../schemas/contact-schema.js';

export const getListContacts = async (req, res, next) => {
  try {
    const result = await contactModel.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactModel.getContactById(id);
    res.json(result);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
  } catch (error) {
    next(error);
  }
};

export const add = async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contactModel.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { error } = contactUpdateSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await contactModel.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactModel.removeContact(id);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json({ message: 'contact deleted' });
  } catch (error) {
    next(error);
  }
};
