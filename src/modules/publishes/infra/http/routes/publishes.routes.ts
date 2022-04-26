import { Router } from 'express';

import ensureIsAuthenticated from '@modules/users/infra/http/middlewares/ensureIsAuthenticated';
import ensureEmailIsVerified from '@modules/users/infra/http/middlewares/ensureEmailIsVerified';

import PublishesController from '../controllers/PublishesController';
import ReceiversController from '../controllers/ReceiversController';

const publishesRouter = Router();

const publishesController = new PublishesController();
const receiversController = new ReceiversController();

publishesRouter.use(ensureIsAuthenticated);
publishesRouter.use(ensureEmailIsVerified);

publishesRouter.get('/:publish_id', publishesController.index);
publishesRouter.post('/', publishesController.create);
publishesRouter.put('/', publishesController.update);
publishesRouter.delete('/:publish_id', publishesController.delete);

publishesRouter.get('/receivers/:publish_id', receiversController.list);

export default publishesRouter;
