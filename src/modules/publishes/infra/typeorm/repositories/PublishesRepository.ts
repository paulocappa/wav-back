import { ObjectId } from 'bson';
import { getMongoRepository, MongoRepository } from 'typeorm';
import { subMonths } from 'date-fns';

import ICreatePublishDTO from '@modules/publishes/dtos/ICreatePublishDTO';
import IPublishesRepository, {
  IUpdateSeenResponse,
} from '@modules/publishes/repositories/IPublishesRepository';

import IListRecentPublishesDTO, {
  ListType,
} from '@modules/publishes/dtos/IListRecentPublishesDTO';

import AppError from '@shared/errors/AppError';
import userProject from '@modules/users/infra/typeorm/mongoProjects/UserProject';
import IUpdatePublishSeenDTO from '@modules/publishes/dtos/IUpdatePublishSeenDTO';
import IListReceiversSeenDTO from '@modules/publishes/dtos/IListReceiversSeenDTO';

import Publish from '../schemas/Publish';
import publishProject from '../mongoProjects/PublishProject';

interface IUserCounter {
  [key: string]: {
    views: number;
    reactions: number;
  };
}

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
    const notElemMatch = {
      $not: {
        $elemMatch: {
          user_id,
        },
      },
    };

    switch (list_type) {
      case 'world':
        return {
          to_world: {
            $eq: true,
          },
          $and: [
            {
              direct_receivers: notElemMatch,
            },
            {
              followers_receivers: notElemMatch,
            },
            {
              receivers_seen: notElemMatch,
            },
          ],
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
  }: IUpdatePublishSeenDTO): Promise<IUpdateSeenResponse> {
    const parsedUserId = new ObjectId(user_id);
    const nowDate = new Date();

    const publishIds = seen_data.map(el => new ObjectId(el.publish_id));

    const publishes = await this.ormRepository
      .aggregate<Publish>([
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

    const userCounter = {} as IUserCounter;

    const updatePublishData = publishes.map(publish => {
      const creatorId = String(publish.user_id);

      const reaction =
        seen_data.find(el => el.publish_id === String(publish.id))?.reaction ||
        null;

      const incrementData: Partial<
        Pick<Publish, 'count_reactions' | 'count_seen' | 'range'>
      > = {
        count_seen: 1,
        range: -1,
      };

      userCounter[creatorId] = {
        views: 0,
        reactions: 0,

        ...userCounter[creatorId],
      };

      userCounter[creatorId].views += 1;

      if (reaction) {
        userCounter[creatorId].reactions += 1;

        incrementData.count_reactions = 1;
      }

      return {
        updateOne: {
          filter: {
            _id: publish.id,
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

    return {
      counter: userCounter,
      publishes,
    };
  }

  public async findByUserAndPublishId(
    user_id: string,
    publish_id: string,
  ): Promise<Publish> {
    const publish = await this.ormRepository
      .aggregate([
        {
          $match: {
            _id: new ObjectId(publish_id),
            user_id: new ObjectId(user_id),
          },
        },
        {
          $project: publishProject([
            'file',
            'user_id',
            'ban_info',
            'text',
            'watermark',
            'to_world',
            'count_seen',
            'count_reactions',
            'created_at',
            'location',
          ]),
        },
      ])
      .toArray();

    return publish[0];
  }

  public async listReceiversSeen({
    user_id,
    publish_id,
    page,
    per_page,
  }: IListReceiversSeenDTO): Promise<Publish> {
    const usersSeen = await this.ormRepository
      .aggregate<Publish>([
        {
          $match: {
            _id: new ObjectId(publish_id),
            user_id: new ObjectId(user_id),
          },
        },
        {
          $project: {
            receivers_seen: {
              $slice: ['$receivers_seen', (page - 1) * per_page, per_page],
            },
          },
        },
        {
          $unwind: '$receivers_seen',
        },
        {
          $lookup: {
            from: 'users',
            as: 'users',
            let: {
              userId: '$receivers_seen.user_id',
              receivers: '$receivers_seen',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$userId'],
                  },
                },
              },
              {
                $project: userProject([
                  'name',
                  'username',
                  'avatar',
                  'location',
                  'count_followers',
                  'count_following',
                ]),
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: ['$$receivers', '$$ROOT'],
                  },
                },
              },
            ],
          },
        },
        {
          $group: {
            _id: '$_id',
            receivers_seen: {
              $push: {
                $first: '$users',
              },
            },
          },
        },
        {
          $project: {
            id: '$_id',
            _id: 0,
            receivers_seen: 1,
          },
        },
      ])
      .toArray();

    return usersSeen[0];
  }
}

export default PublishesRepository;
