import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswordMailService from '@modules/users/services/SendForgotPasswordMailService';
import ForgotPasswordValidation from '../validations/ForgotPasswordValidation';

class ForgotPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    await new ForgotPasswordValidation().create(req.body);

    const { email } = req.body;

    const sendForgotPasswordMailService = container.resolve(
      SendForgotPasswordMailService,
    );

    await sendForgotPasswordMailService.execute({
      email,
    });

    return res.status(204).json();
  }
}

export default ForgotPasswordController;
