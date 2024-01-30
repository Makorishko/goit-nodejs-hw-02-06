import User from '../models/User.js';
import { HttpError, sendEmail } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import gravatar from 'gravatar';
import path from 'path';
import fs from 'fs/promises';
import Jimp from 'jimp';
import { nanoid } from 'nanoid';

const avatarPath = path.resolve('public', 'avatars');

dotenv.config();
const { JWT_SECRETKEY, BASE_URL } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(404, 'Email already in use');
  }
  const hashPassword = await bcryptjs.hash(password, 10);
  const verificationToken = nanoid();
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click confirm email</a>`,
  };

  await sendEmail(verifyEmail);
  res.json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(400, 'Email not found or already verify');
  }

  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: '' });

  res.json({
    message: 'Verification successful',
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, 'Email not found');
  }
  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed');
  }

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: 'Verification email sent',
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password invalid');
  }

  if (!user.verify) {
    throw HttpError(401, 'Email not verify');
  }

  const passwordCompare = await bcryptjs.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const { _id: id } = user;
  const payload = {
    id,
  };
  const token = jwt.sign(payload, JWT_SECRETKEY, { expiresIn: '23h' });
  await User.findByIdAndUpdate(id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    user: {
      email,
      subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: ' ' });
  res.status(204).json();
};

const updateAvatar = async ({ user, file }, res) => {
  const { _id } = user;
  if (!file) {
    throw HttpError(406, 'Error loading avatar');
  }
  const { path: oldPath, filename } = file;

  const avatar = await Jimp.read(oldPath);
  await avatar.cover(250, 250).quality(60).writeAsync(oldPath);
  const newName = `${_id}_${filename}`;
  const newPath = path.join(avatarPath, newName);
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join('avatars', newName);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
};

export default {
  signup: ctrlWrapper(signup),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
