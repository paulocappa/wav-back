import { ObjectId } from 'bson';
import { getMongoRepository, MongoRepository } from 'typeorm';

import ICreateNotificationDTO, {
  TypeNotification,
} from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

import Notification from '../schemas/Notification';

type INewRecord<T extends TypeNotification> = Omit<
  ICreateNotificationDTO<T>,
  'user_id' | 'to_user_id'
> & {
  type: T;
  created_at: Date;
  user_id: ObjectId;
};

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification);
  }

  public async create<T extends TypeNotification>(
    type: T,
    data: ICreateNotificationDTO<T>,
  ): Promise<void> {
    const { user_id, to_user_id } = data;

    let userNotification = await this.ormRepository.findOne({
      where: {
        user_id: new ObjectId(to_user_id),
      },
    });

    if (!userNotification) {
      userNotification = this.ormRepository.create({
        user_id: new ObjectId(to_user_id),
      });

      await this.ormRepository.save(userNotification);
    }

    const newRecord = {};

    if (type === 'reaction') {
      const { publish_id, reaction } =
        data as ICreateNotificationDTO<'reaction'>;

      const record: Omit<INewRecord<'reaction'>, 'publish_id'> & {
        publish_id: ObjectId;
      } = {
        user_id: new ObjectId(user_id),
        publish_id: new ObjectId(publish_id),
        created_at: new Date(),
        reaction,
        type,
      };

      Object.assign(newRecord, record);
    } else if (type === 'follow') {
      const record: INewRecord<'follow'> = {
        user_id: new ObjectId(user_id),
        created_at: new Date(),
        type,
      };

      Object.assign(newRecord, record);
    }

    await this.ormRepository.updateOne(
      {
        _id: userNotification.id,
      },
      {
        $push: {
          records: {
            $each: [newRecord],
            $position: 0,
          },
        },
      },
    );
  }

  public async delete(notification_id: string): Promise<void> {
    await this.ormRepository.deleteOne(new ObjectId(notification_id));
  }
}

export default NotificationsRepository;
