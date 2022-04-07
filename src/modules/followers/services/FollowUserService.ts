import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Follower from '@modules/followers/infra/typeorm/schemas/Follower';

import IFollowersRepository from '@modules/followers/repositories/IFollowersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

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

    return follower;
  }
}

export default FollowUserService;
