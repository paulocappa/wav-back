import { ObjectId } from 'bson';
import { getMongoRepository, MongoRepository } from 'typeorm';

import Follower from '@modules/followers/infra/typeorm/schemas/Follower';

import IFollowersRepository, {
  IFollowData,
  IIsFollowingData,
  IUnfollowData,
} from '@modules/followers/repositories/IFollowersRepository';

class FollowersRepository implements IFollowersRepository {
  private ormRepository: MongoRepository<Follower>;

  constructor() {
    this.ormRepository = getMongoRepository(Follower);
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

  public async getFollowers(user_id: string): Promise<Follower[]> {
    const followers = await this.ormRepository
      .aggregate([
        {
          $match: {
            following: new ObjectId(user_id),
          },
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
                $project: {
                  _id: 1,
                  name: 1,
                  username: 1,
                },
              },
            ],
          },
        },
      ])
      .toArray();

    return followers;
  }

  public async getFollowing(user_id: string): Promise<Follower[]> {
    const following = await this.ormRepository
      .aggregate([
        {
          $match: {
            user_id: new ObjectId(user_id),
          },
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
                $project: {
                  _id: 1,
                  name: 1,
                  username: 1,
                },
              },
            ],
          },
        },
      ])
      .toArray();

    return following;
  }
}

export default FollowersRepository;
