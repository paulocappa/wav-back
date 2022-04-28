import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToPlain } from 'class-transformer';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import SessionsValidation from '../validations/SessionsValidation';

class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    await new SessionsValidation().create(req.body);

    const { email, password } = req.body;

    const authenticateUserService = container.resolve(AuthenticateUserService);

    const { user, tokens } = await authenticateUserService.execute({
      email,
      password,
    });

    return res.json({
      user: instanceToPlain(user),
      tokens,
    });
  }
}

export default SessionsController;
