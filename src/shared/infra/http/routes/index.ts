import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import publishesRouter from '@modules/publishes/infra/http/routes/publishes.routes';
import followersRouter from '@modules/followers/infra/http/routes/followers.routes';
import timelineRouter from '@modules/publishes/infra/http/routes/timeline.routes';

const routes = Router();

// USERS
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);

// PUBLISHES
routes.use('/publishes', publishesRouter);

// TIMELINE
routes.use('/timeline', timelineRouter);

// FOLLOWERS
routes.use('/followers', followersRouter);

export default routes;
