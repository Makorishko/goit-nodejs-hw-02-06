import { HttpError } from '../helpers/index.js';

export default function isEmptyBody(req, res, next) {
  const { length } = Object.keys(req.body);
  if (!length) {
    return next(HttpError(400, 'Missing field favorite'));
  }
  next();
}
