import express from 'express';
import * as contactController from '../../controllers/contacts-controllers.js';
import { isEmptyBody } from '../../middlewares/index.js';

const router = express.Router();

router.get('/', contactController.getListContacts);

router.get('/:id', contactController.getById);

router.post('/', isEmptyBody, contactController.add);

router.delete('/:id', contactController.remove);

router.put('/:id', isEmptyBody, contactController.update);

export default router;
