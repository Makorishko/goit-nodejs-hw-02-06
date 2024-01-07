import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { HttpError } from '../helpers/index.js';
import Users from '../models/User.js';

dotenv.config();

const { JWT_SECRETKEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpError(401, 'Not authorized'));
  }
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return next(HttpError(401));
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRETKEY);
      const user = await Users.findById(id);
      req.user = user;
    if (!user) {
      return next(HttpError(401, 'Not authorized'));
    }
      next();
  } catch (error) {
    next(HttpError(401, error.message));
  }
};

export default authenticate;
