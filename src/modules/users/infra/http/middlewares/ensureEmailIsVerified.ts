import { Response, Request, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

export default async function ensureEmailIsVerified(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  const { user_id } = req;

  const usersRepository = new UsersRepository();

  const user = await usersRepository.findById(user_id);

  if (!user.email_verified) {
    throw new AppError('You need to confirm your email first', 401);
  }

  next();
}
