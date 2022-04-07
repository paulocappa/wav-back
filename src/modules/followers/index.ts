import { container } from 'tsyringe';

import IFollowersRepository from './repositories/IFollowersRepository';
import FollowersRepository from './infra/typeorm/repositories/FollowersRepository';

container.registerSingleton<IFollowersRepository>(
  'FollowersRepository',
  FollowersRepository,
);
