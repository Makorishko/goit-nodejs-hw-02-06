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
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
});

userSchema.post('save', handleSaveError);
userSchema.pre('findByIdAndUpdate', handlerUpdate);
userSchema.post('findByIdAndUpdate', handleSaveError);

export const userSignupSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
export const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const User = model('user', userSchema);

export default User;
