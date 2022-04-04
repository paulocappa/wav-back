import { Router } from 'express';

import multer from 'multer';

import uploadConfig from '@config/upload';

import ensureIsAuthenticated from '@modules/users/infra/http/middlewares/ensureIsAuthenticated';
import ensureEmailIsVerified from '@modules/users/infra/http/middlewares/ensureEmailIsVerified';

import UsersController from '../controllers/UsersController';
import AvatarController from '../controllers/AvatarController';
import EmailController from '../controllers/EmailController';

const upload = multer(uploadConfig.multer);

const usersRouter = Router();

const usersController = new UsersController();
const avatarController = new AvatarController();
const emailController = new EmailController();

usersRouter.post('/', usersController.create);
usersRouter.put('/email', emailController.update);

usersRouter.use(ensureIsAuthenticated);
usersRouter.use(ensureEmailIsVerified);

usersRouter.get('/', usersController.index);
usersRouter.put('/', usersController.update);
usersRouter.patch('/avatar', upload.single('avatar'), avatarController.update);

export default usersRouter;
