import { Schema, model } from 'mongoose';
import { handleSaveError, handlerUpdate } from './hooks.js';
import Joi from 'joi';

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    match: emailRegexp,
    required: [true, 'Email is required'],
    unique: true,
  },
  avatarURL: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter',
  },
  token: String,
});

userSchema.post('save', handleSaveError);
userSchema.pre('findOneAndUpdate', handlerUpdate);
userSchema.post('findOneAndUpdate', handleSaveError);

export const userSignupSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const User = model('user', userSchema);

export default User;
