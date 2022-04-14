import { ObjectId } from 'bson';
import { getMongoRepository, MongoRepository } from 'typeorm';

import Follower from '@modules/followers/infra/typeorm/schemas/Follower';

import IFollowersRepository, {
  IFollowData,
  IIsFollowingData,
  IListData,
  IUnfollowData,
} from '@modules/followers/repositories/IFollowersRepository';
import userProject from '@modules/users/infra/typeorm/mongoProjects/UserProject';

class FollowersRepository implements IFollowersRepository {
  private ormRepository: MongoRepository<Follower>;

  constructor() {
    this.ormRepository = getMongoRepository(Follower);
  }

  get followersOrmRepository(): MongoRepository<Follower> {
    return this.ormRepository;
  }

  public async follow({
    user_id,
    user_to_follow_id,
  }: IFollowData): Promise<Follower> {
    const userFollow = this.ormRepository.create({
      user_id: new ObjectId(user_id),
      following: new ObjectId(user_to_follow_id),
    });

    await this.ormRepository.save(userFollow);

    return userFollow;
  }

  public async unfollow({
    user_id,
    user_to_unfollow_id,
  }: IUnfollowData): Promise<void> {
    await this.ormRepository.deleteOne({
      user_id: new ObjectId(user_id),
      following: new ObjectId(user_to_unfollow_id),
    });
  }

  public async isFollowing({
    user_id,
    following_user_id,
  }: IIsFollowingData): Promise<Follower> {
    const userIsFollowing = await this.ormRepository.findOne({
      user_id: new ObjectId(user_id),
      following: new ObjectId(following_user_id),
    });

    return userIsFollowing;
  }

  public async getAllFollowers(
    user_id: string,
    excludeIds?: string[],
  ): Promise<Follower[]> {
    const parsedExcludeIds = excludeIds.map(id => new ObjectId(id)) ?? [];

    const followers = await this.ormRepository.find({
      where: {
        user_id: {
          $nin: parsedExcludeIds,
        },
        following: new ObjectId(user_id),
      },
    });

    return followers;
  }

  public async getFollowers({
    user_id,
    page,
    per_page,
  }: IListData): Promise<Follower[]> {
    const followers = await this.ormRepository
      .aggregate<Follower>([
        {
          $match: {
            following: new ObjectId(user_id),
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
            let: { user_id: '$user_id' },
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
                  'username',
                  'avatar',
                  'location',
                  'count_followers',
                  'count_following',
                ]),
              },
            ],
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            _id: 0,
            id: '$_id',
            user: 1,
          },
        },
      ])
      .toArray();

    return followers;
  }

  public async getFollowing({
    user_id,
    page,
    per_page,
  }: IListData): Promise<Follower[]> {
    const following = await this.ormRepository
      .aggregate<Follower>([
        {
          $match: {
            user_id: new ObjectId(user_id),
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
            let: { user_id: '$following' },
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
                  'username',
                  'avatar',
                  'location',
                  'count_followers',
                  'count_following',
                ]),
              },
            ],
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            _id: 0,
            id: '$_id',
            user: 1,
          },
        },
      ])
      .toArray();

    return following;
  }

  public async removeAllFollowers(user_id: string): Promise<number> {
    const user = new ObjectId(user_id);

    const countDeleted = await this.ormRepository.count({
      following: user,
    });

    await this.ormRepository.deleteMany({
      following: user,
    });

    return countDeleted;
  }

  public async removeAllFollowing(user_id: string): Promise<number> {
    const user = new ObjectId(user_id);

    const countDeleted = await this.ormRepository.count({
      user_id: user,
    });

    await this.ormRepository.deleteMany({
      user_id: user,
    });

    return countDeleted;
  }
}

export default FollowersRepository;
