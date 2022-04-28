import { Response, Request, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';

import TokenProvider from '@modules/users/providers/TokenProvider/implementations/JWTTokenProvider';

export default async function ensureIsAuthenticated(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token is missing', 401);
  }

  const token = authHeader.split(' ').pop();

  try {
    const tokenProvider = new TokenProvider();

    const decoded = await tokenProvider.verify(token);

    req.user_id = decoded;

    next();
  } catch (error) {
    throw new AppError('Invalid JWT Token', 401);
  }
}
