import { isValidObjectId } from 'mongoose';
import { HttpError } from '../helpers/index.js';

export default function isValidId(req, res, next){
    const { id } = req.params;
    if (!isValidObjectId(id)) { 
        return next(HttpError(404, `${id} is not valid id`))
    }
    next();
};
