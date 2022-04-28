import { container } from 'tsyringe';

import './providers';

import IUsersRepository from './repositories/IUsersRepository';
import UsersRepository from './infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from './repositories/IUserTokensRepository';
import UserTokensRepository from './infra/typeorm/repositories/UserTokensRepository';

import IRefreshTokenRepository from './repositories/IRefreshTokenRepository';
import RefreshTokenRepository from './infra/typeorm/repositories/RefreshTokenRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<IRefreshTokenRepository>(
  'RefreshTokenRepository',
  RefreshTokenRepository,
);
