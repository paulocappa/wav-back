import { Router } from 'express';

import RefreshTokenController from '../controllers/RefreshTokenController';

const refreshTokenRouter = Router();

const refreshTokenController = new RefreshTokenController();

refreshTokenRouter.post('/', refreshTokenController.create);

export default refreshTokenRouter;
