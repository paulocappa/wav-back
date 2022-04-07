import { Router } from 'express';

import ensureIsAuthenticated from '@modules/users/infra/http/middlewares/ensureIsAuthenticated';
import ensureEmailIsVerified from '@modules/users/infra/http/middlewares/ensureEmailIsVerified';

import FollowersController from '../controllers/FollowersController';

const followersRouter = Router();

const followersController = new FollowersController();

followersRouter.use(ensureIsAuthenticated);
followersRouter.use(ensureEmailIsVerified);

followersRouter.get('/', followersController.index);
followersRouter.post('/', followersController.create);
followersRouter.delete('/:id', followersController.delete);

export default followersRouter;
