import { Router } from 'express';

import ensureIsAuthenticated from '@modules/users/infra/http/middlewares/ensureIsAuthenticated';
import ensureEmailIsVerified from '@modules/users/infra/http/middlewares/ensureEmailIsVerified';

import TimelineController from '../controllers/TimelineController';

const timelineRouter = Router();

const timelineController = new TimelineController();

timelineRouter.use(ensureIsAuthenticated);
timelineRouter.use(ensureEmailIsVerified);

timelineRouter.get('/', timelineController.list);

export default timelineRouter;
