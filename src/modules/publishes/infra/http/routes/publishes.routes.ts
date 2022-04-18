import { Router } from 'express';

import ensureIsAuthenticated from '@modules/users/infra/http/middlewares/ensureIsAuthenticated';
import ensureEmailIsVerified from '@modules/users/infra/http/middlewares/ensureEmailIsVerified';

import PublishesController from '../controllers/PublishesController';

const publishesRouter = Router();

const publishesController = new PublishesController();

publishesRouter.use(ensureIsAuthenticated);
publishesRouter.use(ensureEmailIsVerified);

publishesRouter.post('/', publishesController.create);
publishesRouter.put('/', publishesController.update);
publishesRouter.delete('/', publishesController.delete);

export default publishesRouter;
