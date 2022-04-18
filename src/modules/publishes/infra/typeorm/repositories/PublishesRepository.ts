import { ObjectId } from 'bson';
import { getMongoRepository, MongoRepository } from 'typeorm';
import { subMonths } from 'date-fns';

import ICreatePublishDTO from '@modules/publishes/dtos/ICreatePublishDTO';
import IPublishesRepository from '@modules/publishes/repositories/IPublishesRepository';

import IListRecentPublishesDTO, {
  ListType,
} from '@modules/publishes/dtos/IListRecentPublishesDTO';

import AppError from '@shared/errors/AppError';
import userProject from '@modules/users/infra/typeorm/mongoProjects/UserProject';
import IUpdatePublishSeenDTO from '@modules/publishes/dtos/IUpdatePublishSeenDTO';
import Publish from '../schemas/Publish';
import publishProject from '../mongoProjects/PublishProject';

class PublishesRepository implements IPublishesRepository {
  private ormRepository: MongoRepository<Publish>;

  constructor() {
    this.ormRepository = getMongoRepository(Publish);
  }

  public async create({
    user_id,
    text,
    watermark,
    followers_receivers,
    direct_receivers,
    location,
    range,
    file,
    to_world,
  }: ICreatePublishDTO): Promise<Publish> {
    const publish = this.ormRepository.create({
      user_id: new ObjectId(user_id),
      text,
      watermark,
      file,
      followers_receivers,
      direct_receivers,
      range,
      location,
      to_world,
    });

    await this.ormRepository.save(publish);

    return publish;
  }

  public async findById(publish_id: string): Promise<Publish> {
    const publish = await this.ormRepository.findOne(publish_id);

    return publish;
  }

  public async delete(publish_id: string): Promise<void> {
    await this.ormRepository.delete(publish_id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getListQuery(user_id: ObjectId, list_type: ListType): any {
    switch (list_type) {
      case 'world':
        return {
          to_world: {
            $eq: true,
          },
          direct_receivers: {
            $not: {
              $elemMatch: {
                user_id,
              },
            },
          },
          followers_receivers: {
            $not: {
              $elemMatch: {
                user_id,
              },
            },
          },
        };
      case 'follower':
        return {
          followers_receivers: {
            $elemMatch: {
              user_id,
              seen: false,
            },
          },
        };
      case 'direct':
        return {
          direct_receivers: {
            $elemMatch: {
              user_id,
              seen: false,
            },
          },
        };
      default:
        throw new AppError('List query not found');
    }
  }

  public async listRecentPublishes({
    user_id,
    list_type,
    page,
    per_page,
  }: IListRecentPublishesDTO): Promise<Publish[]> {
    const matchQuery = this.getListQuery(new ObjectId(user_id), list_type);

    const oneMonthAgo = subMonths(new Date(), 1);

    const publishes = await this.ormRepository
      .aggregate([
        {
          $match: {
            user_id: {
              $ne: new ObjectId(user_id),
            },
            created_at: {
              $gte: oneMonthAgo,
            },
            ...matchQuery,
          },
        },
        {
          $skip: (page - 1) * per_page,
        },
        {
          $limit: per_page,
        },
        {
          $lookup: {
            from: 'users',
            as: 'user',
            let: {
              user_id: '$user_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$user_id'],
                  },
                },
              },
              {
                $project: userProject([
                  'name',
                  'range',
                  'avatar',
                  'username',
                  'location',
                  'count_followers',
                  'count_following',
                ]),
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$user',
          },
        },
        {
          $project: {
            user: 1,
            ...publishProject([
              'user_id',
              'file',
              'watermark',
              'text',
              'location',
            ]),
          },
        },
      ])
      .toArray();

    return publishes;
  }

  public async updateSeen({
    user_id,
    seen_data,
  }: IUpdatePublishSeenDTO): Promise<
    Record<string, { views: number; reactions: number }>
  > {
    const parsedUserId = new ObjectId(user_id);
    const nowDate = new Date();

    const publishIds = seen_data.map(el => new ObjectId(el.publish_id));

    const publishes = await this.ormRepository
      .aggregate([
        {
          $match: {
            _id: {
              $in: publishIds,
            },
            receivers_seen: {
              $not: {
                $elemMatch: {
                  user_id: parsedUserId,
                },
              },
            },
          },
        },
      ])
      .toArray();

    const userCounter = {} as Record<
      string,
      { views: number; reactions: number }
    >;

    const updatePublishData = publishes.map(publish => {
      const creatorId = String(publish.user_id);

      const reaction =
        seen_data.find(el => el.publish_id === String(publish._id))?.reaction ||
        null;

      userCounter[creatorId] = {
        views: 0,
        reactions: 0,

        ...userCounter[creatorId],
      };

      userCounter[creatorId].views += 1;

      if (reaction) {
        userCounter[creatorId].reactions += 1;
      }

      const incrementData: Partial<
        Pick<Publish, 'count_reactions' | 'count_seen' | 'range'>
      > = {
        count_seen: 1,
        range: -1,
      };

      if (reaction) {
        incrementData.count_reactions = 1;
      }

      return {
        updateOne: {
          filter: {
            _id: publish._id,
          },
          update: {
            $push: {
              receivers_seen: {
                $each: [
                  {
                    user_id: parsedUserId,
                    reaction,
                    seen_at: nowDate,
                  },
                ],
                $position: 0,
              },
            },
            $inc: incrementData,
          },
        },
      };
    });

    if (updatePublishData.length) {
      await this.ormRepository.bulkWrite(updatePublishData);
    }

    return userCounter;
  }
}

export default PublishesRepository;
