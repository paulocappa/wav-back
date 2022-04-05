import { Router } from 'express';

import multer from 'multer';

import uploadConfig from '@config/upload';

import ensureIsAuthenticated from '@modules/users/infra/http/middlewares/ensureIsAuthenticated';
import ensureEmailIsVerified from '@modules/users/infra/http/middlewares/ensureEmailIsVerified';

import PublishesController from '../controllers/PublishesController';

const upload = multer(uploadConfig.multer);

const publishesRouter = Router();

const publishesController = new PublishesController();

publishesRouter.use(ensureIsAuthenticated);
publishesRouter.use(ensureEmailIsVerified);

publishesRouter.post('/', upload.single('file'), publishesController.create);

export default publishesRouter;
