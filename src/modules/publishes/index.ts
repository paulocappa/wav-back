import { container } from 'tsyringe';

import IPublishesRepository from './repositories/IPublishesRepository';
import PublishesRepository from './infra/typeorm/repositories/PublishesRepository';

container.registerSingleton<IPublishesRepository>(
  'PublishesRepository',
  PublishesRepository,
);
