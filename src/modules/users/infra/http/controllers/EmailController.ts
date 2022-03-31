import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToPlain } from 'class-transformer';

import VerifyEmailService from '@modules/users/services/VerifyEmailService';
import EmailValidation from '../validations/EmailValidation';

class EmailController {
  public async update(req: Request, res: Response): Promise<Response> {
    await new EmailValidation().update(req.body);

    const { email, code } = req.body;

    const verifyEmailService = container.resolve(VerifyEmailService);

    const user = await verifyEmailService.execute({
      email,
      code,
    });

    return res.json(instanceToPlain(user));
  }
}

export default EmailController;
