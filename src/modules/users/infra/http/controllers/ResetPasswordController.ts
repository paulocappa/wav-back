import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import ResetPasswordValidation from '../validations/ResetPasswordValidation';

class ResetPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    await new ResetPasswordValidation().create(req.body);

    const { token, password, confirm_password } = req.body;

    const resetPasswordService = container.resolve(ResetPasswordService);

    await resetPasswordService.execute({
      token,
      password,
      confirm_password,
    });

    return res.status(204).json();
  }
}

export default ResetPasswordController;
