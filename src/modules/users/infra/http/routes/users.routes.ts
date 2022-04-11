import { Router } from 'express';

import multer from 'multer';

import uploadConfig from '@config/upload';

import ensureIsAuthenticated from '@modules/users/infra/http/middlewares/ensureIsAuthenticated';
import ensureEmailIsVerified from '@modules/users/infra/http/middlewares/ensureEmailIsVerified';

import UsersController from '../controllers/UsersController';
import UsersLocationController from '../controllers/UsersLocationController';
import AvatarController from '../controllers/AvatarController';
import EmailController from '../controllers/EmailController';

const upload = multer(uploadConfig.multer);

const usersRouter = Router();

const usersController = new UsersController();
const usersLocationController = new UsersLocationController();
const avatarController = new AvatarController();
const emailController = new EmailController();

usersRouter.post('/', usersController.create);
usersRouter.put('/email', emailController.update);

usersRouter.use(ensureIsAuthenticated);
usersRouter.use(ensureEmailIsVerified);

usersRouter.get('/', usersController.index);
usersRouter.put('/', usersController.update);
usersRouter.put('/location', usersLocationController.update);
usersRouter.patch('/avatar', upload.single('avatar'), avatarController.update);

export default usersRouter;
