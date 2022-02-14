import { Response, Request, NextFunction } from 'express';
import { container } from 'tsyringe';

import CheckUserIsAdministrator from '@modules/users/utils/CheckUserIsAdministrator';

import AppError from '@shared/errors/AppError';

export default async function isAdministrator(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  const { user_id } = req;

  const checkUserIsAdministrator = container.resolve(CheckUserIsAdministrator);

  const userIsAdministrator = await checkUserIsAdministrator.execute(user_id);

  if (!userIsAdministrator) {
    throw new AppError('Only administrator users can access this route', 401);
  }

  next();
}
