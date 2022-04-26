import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import type { FieldsToUpdate } from '@modules/users/dtos/IIncrementManyUsersCountDTO';
import type { SeenData } from '../dtos/IUpdatePublishSeenDTO';

import IPublishesRepository from '../repositories/IPublishesRepository';

interface IRequest {
  user_id: string;
  seen_data: SeenData[];
}

@injectable()
class UpdatePublishesSeenService {
  constructor(
    @inject('PublishesRepository')
    private publishesRepository: IPublishesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id, seen_data }: IRequest): Promise<void> {
    const usersCounter = await this.publishesRepository.updateSeen({
      user_id,
      seen_data,
    });

    const formatUsersCounter = Object.entries(usersCounter).map(
      ([userId, counters]) => {
        const fieldsToUpdate: FieldsToUpdate[] = Object.entries(counters).map(
          ([key, value]) => {
            switch (key) {
              case 'views':
                return { field: 'count_views', count: value };
              case 'reactions':
                return { field: 'count_reactions', count: value };
              default:
                return null;
            }
          },
        );

        return {
          user_id: userId,
          fieldsToUpdate,
        };
      },
    );

    if (formatUsersCounter.length) {
      await this.usersRepository.incrementManyUsersCount(formatUsersCounter);
    }

    await this.cacheProvider.invalidatePrefix(`world-timeline:${user_id}`);
  }
}

export default UpdatePublishesSeenService;
