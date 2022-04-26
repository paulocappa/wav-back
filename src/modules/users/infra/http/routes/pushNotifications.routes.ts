import { Router } from 'express';

import PushNotificationsController from '../controllers/PushNotificationsController';

const pushNotificationsRouter = Router();

const pushNotificationsController = new PushNotificationsController();

pushNotificationsRouter.post('/update', pushNotificationsController.update);

export default pushNotificationsRouter;
