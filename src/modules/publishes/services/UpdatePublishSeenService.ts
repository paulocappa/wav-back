import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

import type { FieldsToUpdate } from '@modules/users/dtos/IIncrementManyUsersCountDTO';
import { ICreateReactionNotificationDTO } from '@modules/notifications/dtos/ICreateNotificationDTO';
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

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id, seen_data }: IRequest): Promise<void> {
    const { counter, publishes } = await this.publishesRepository.updateSeen({
      user_id,
      seen_data,
    });

    const reactionNotifications = [] as ICreateReactionNotificationDTO[];

    publishes.forEach(({ id, user_id: creator_id }) => {
      const publishHasReaction = seen_data.find(
        ({ publish_id, reaction }) => publish_id === String(id) && !!reaction,
      );

      if (publishHasReaction) {
        const { reaction, publish_id } = publishHasReaction;

        reactionNotifications.push({
          user_id,
          reaction,
          publish_id,
          to_user_id: String(creator_id),
        });
      }
    });

    const formatUsersCounter = Object.entries(counter).map(
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

    if (reactionNotifications.length) {
      await this.notificationsRepository.createReactionNotifications(
        reactionNotifications,
      );
    }

    if (formatUsersCounter.length) {
      await this.usersRepository.incrementManyUsersCount(formatUsersCounter);
    }

    await this.cacheProvider.invalidatePrefix(`world-timeline:${user_id}`);

    await Promise.all(
      seen_data.map(async ({ publish_id }) => {
        const cacheKeyPrefix = `publish-receivers-seen:${publish_id}:*`;

        await this.cacheProvider.invalidatePrefix(cacheKeyPrefix);
      }),
    );
  }
}

export default UpdatePublishesSeenService;
