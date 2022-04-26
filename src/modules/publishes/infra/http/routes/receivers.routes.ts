import { Router } from 'express';

import ensureIsAuthenticated from '@modules/users/infra/http/middlewares/ensureIsAuthenticated';
import ensureEmailIsVerified from '@modules/users/infra/http/middlewares/ensureEmailIsVerified';

import ReceiversController from '../controllers/ReceiversController';

const receiversRouter = Router();

const receiversController = new ReceiversController();

receiversRouter.use(ensureIsAuthenticated);
receiversRouter.use(ensureEmailIsVerified);

receiversRouter.get('/:publish_id', receiversController.list);

export default receiversRouter;
