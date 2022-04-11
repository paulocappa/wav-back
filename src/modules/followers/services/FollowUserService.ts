import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Follower from '@modules/followers/infra/typeorm/schemas/Follower';

import IFollowersRepository from '@modules/followers/repositories/IFollowersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id: string;
  user_follow: string;
}

@injectable()
class FollowUserService {
  constructor(
    @inject('FollowersRepository')
    private followersRepository: IFollowersRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id, user_follow }: IRequest): Promise<Follower> {
    const userToFollowExists = await this.usersRepository.findById(user_follow);

    if (!userToFollowExists) {
      throw new AppError('Provided user does not exists');
    }

    const alredyFollowing = await this.followersRepository.isFollowing({
      user_id,
      following_user_id: user_follow,
    });

    if (alredyFollowing) {
      throw new AppError('You are alredy following this user');
    }

    const follower = await this.followersRepository.follow({
      user_id,
      user_to_follow_id: user_follow,
    });

    await this.usersRepository.incrementFollowersCount({
      user_id: user_follow,
    });

    await this.usersRepository.incrementFollowingCount({
      user_id,
    });

    await this.cacheProvider.invalidateMany([
      `user-info:${user_id}`,
      `user-following:${user_id}`,
      `user-info:${user_follow}`,
      `user-followers:${user_follow}`,
    ]);

    await this.cacheProvider.invalidatePrefix(`user-followers:${user_follow}`);
    await this.cacheProvider.invalidatePrefix(`user-following:${user_id}`);

    return follower;
  }
}

export default FollowUserService;
