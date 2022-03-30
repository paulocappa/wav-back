import { Response, Request, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

const usersRepository = new UsersRepository();

export default async function ensureIsAdministrator(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  const { user_id } = req;

  const user = await usersRepository.findById(user_id);

  if (!user.administrator) {
    throw new AppError('Only administrator users can access this route', 401);
  }

  next();
}
