import { Request, Response } from 'express';

import { container } from 'tsyringe';

import RefreshTokenService from '@modules/users/services/RefreshTokenService';

class RefreshTokenController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { refresh_token } = req.body;

    const refreshTokenService = container.resolve(RefreshTokenService);

    const tokens = await refreshTokenService.execute(refresh_token);

    return res.json(tokens);
  }
}

export default RefreshTokenController;
