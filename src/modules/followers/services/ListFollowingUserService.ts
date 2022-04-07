import { inject, injectable } from 'tsyringe';

import Follower from '@modules/followers/infra/typeorm/schemas/Follower';

import IFollowersRepository from '@modules/followers/repositories/IFollowersRepository';

interface IRequest {
  user_id: string;
  page: string;
  per_page: string;
}

@injectable()
class ListFollowingUserService {
  constructor(
    @inject('FollowersRepository')
    private followersRepository: IFollowersRepository,
  ) {}

  public async execute({
    user_id,
    page,
    per_page,
  }: IRequest): Promise<Follower[]> {
    const followers = await this.followersRepository.getFollowing({
      user_id,
      page: Number(page),
      per_page: Number(per_page),
    });

    return followers;
  }
}

export default ListFollowingUserService;
