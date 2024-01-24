import express from 'express';
import { contactAddSchema, contactUpdateSchema, contactUpdateFavoriteSchema } from '../../models/Contacts.js';
import contactController from '../../controllers/contacts-controllers.js';
import { isEmptyBody, isValidId, isEmptyFavorite } from '../../middlewares/index.js';
import { validateBody } from '../../decorators/index.js';
import { authenticate } from '../../middlewares/index.js';
import { upload} from '../../middlewares/index.js'

const router = express.Router();

router.use(authenticate);

router.get('/', contactController.getListContacts);
router.get('/:id', isValidId, contactController.getById);
router.post('/', upload.single("avatar"), isEmptyBody, validateBody(contactAddSchema), contactController.add);
router.delete('/:id', isValidId, contactController.remove);
router.put('/:id', isEmptyBody, validateBody(contactUpdateSchema), isValidId, contactController.update);
router.patch('/:id/favorite', isEmptyFavorite, isValidId, validateBody(contactUpdateFavoriteSchema), contactController.updateStatusContact);

export default router;
