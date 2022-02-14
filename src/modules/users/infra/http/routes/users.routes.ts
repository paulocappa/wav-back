import { Router } from 'express';

import multer from 'multer';

import uploadConfig from '@config/upload';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import UsersController from '../controllers/UsersController';
import AvatarController from '../controllers/AvatarController';

const upload = multer(uploadConfig);

const usersRouter = Router();

const usersController = new UsersController();
const avatarController = new AvatarController();

usersRouter.post('/', usersController.create);

usersRouter.use(ensureAuthenticated);

usersRouter.put('/', usersController.update);
usersRouter.patch('/avatar', upload.single('avatar'), avatarController.update);

export default usersRouter;
