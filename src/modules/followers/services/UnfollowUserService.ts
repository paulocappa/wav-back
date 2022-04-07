import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IFollowersRepository from '@modules/followers/repositories/IFollowersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

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
  ) {}

  public async execute({ user_id, user_follow }: IRequest): Promise<void> {
    const userToFollowExists = await this.usersRepository.findById(user_follow);

    if (!userToFollowExists) {
      throw new AppError('Provided user does not exists');
    }

    await this.followersRepository.unfollow({
      user_id,
      user_to_unfollow_id: user_follow,
    });
  }
}

export default UnfollowUserService;
