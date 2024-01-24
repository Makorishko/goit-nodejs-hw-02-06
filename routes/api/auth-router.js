import express from 'express';
import { isEmptyBody, authenticate } from '../../middlewares/index.js';
import { validateBody } from '../../decorators/index.js';
import { userSigninSchema, userSignupSchema } from '../../models/User.js';
import authControllers from '../../controllers/auth-controllers.js';
import { upload } from '../../middlewares/index.js';

const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, validateBody(userSignupSchema), authControllers.signup);
authRouter.post('/login', isEmptyBody, validateBody(userSigninSchema), authControllers.signin);
authRouter.get('/current', authenticate, authControllers.getCurrent);
authRouter.post('/logout', authenticate, authControllers.logout);
authRouter.patch('/avatars',authenticate, upload.single("avatar"),authControllers.updateAvatar )

export default authRouter;
