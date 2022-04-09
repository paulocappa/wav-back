import { ObjectId } from 'bson';
import { getMongoRepository, MongoRepository } from 'typeorm';

import Follower from '@modules/followers/infra/typeorm/schemas/Follower';

import IFollowersRepository, {
  IFollowData,
  IIsFollowingData,
  IListData,
  IUnfollowData,
} from '@modules/followers/repositories/IFollowersRepository';

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
            as: 'user_follower',
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
                $project: {
                  _id: 0,
                  id: '$_id',
                  name: 1,
                  username: 1,
                  avatar: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: '$user_follower',
        },
        {
          $project: {
            _id: 0,
            id: '$_id',
            user_follower: 1,
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
            as: 'user_following',
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
                $project: {
                  _id: 0,
                  id: '$_id',
                  name: 1,
                  username: 1,
                  avatar: 1,
                  count_followers: 1,
                  count_following: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: '$user_following',
        },
        {
          $project: {
            _id: 0,
            id: '$_id',
            user_following: 1,
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
