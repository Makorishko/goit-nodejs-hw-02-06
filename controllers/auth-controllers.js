import User from '../models/User.js';
import HttpError from '../helpers/HttpError.js';
import { ctrlWrapper } from '../decorators/index.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRETKEY } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(404, 'Email already in use');
  }
  const hashPassword = await bcryptjs.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });
  res.json({
    username: newUser.username,
    email: newUser.email,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcryptjs.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password invalid');
  }
    
    const { _id: id } = user;
    const payload = {
        id
    }
    const token = jwt.sign(payload, JWT_SECRETKEY, {expiresIn: "23h"});
    
    res.json({ token, });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
};
