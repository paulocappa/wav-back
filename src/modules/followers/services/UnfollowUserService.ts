import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IFollowersRepository from '@modules/followers/repositories/IFollowersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id: string;
  user_follow: string;
}

@injectable()
class UnfollowUserService {
  constructor(
    @inject('FollowersRepository')
    private followersRepository: IFollowersRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id, user_follow }: IRequest): Promise<void> {
    const userToFollowExists = await this.usersRepository.findById(user_follow);

    if (!userToFollowExists) {
      throw new AppError('Provided user does not exists');
    }

    const isFollowing = await this.followersRepository.isFollowing({
      user_id,
      following_user_id: user_follow,
    });

    if (!isFollowing) {
      throw new AppError('You are not following this user!');
    }

    await this.followersRepository.unfollow({
      user_id,
      user_to_unfollow_id: user_follow,
    });

    await this.usersRepository.decrementFieldCount(user_follow, {
      field: 'count_followers',
      count: 1,
    });

    await this.usersRepository.decrementFieldCount(user_id, {
      field: 'count_following',
      count: 1,
    });

    await this.cacheProvider.invalidateMany([
      `user-info:${user_id}`,
      `user-following:${user_id}`,
      `user-info:${user_follow}`,
      `user-followers:${user_follow}`,
    ]);

    await this.cacheProvider.invalidatePrefix(`user-followers:${user_follow}`);
    await this.cacheProvider.invalidatePrefix(`user-following:${user_id}`);
  }
}

export default UnfollowUserService;
