import { Router } from 'express';

import ensureIsAuthenticated from '@modules/users/infra/http/middlewares/ensureIsAuthenticated';
import ensureEmailIsVerified from '@modules/users/infra/http/middlewares/ensureEmailIsVerified';

import PublishesController from '../controllers/PublishesController';

const publishesRouter = Router();

const publishesController = new PublishesController();

publishesRouter.use(ensureIsAuthenticated);
publishesRouter.use(ensureEmailIsVerified);

publishesRouter.get('/:publish_id', publishesController.index);
publishesRouter.post('/', publishesController.create);
publishesRouter.put('/', publishesController.update);
publishesRouter.delete('/:publish_id', publishesController.delete);

export default publishesRouter;
