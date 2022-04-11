import { inject, injectable } from 'tsyringe';

import Follower from '@modules/followers/infra/typeorm/schemas/Follower';

import IFollowersRepository from '@modules/followers/repositories/IFollowersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

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

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
    page,
    per_page,
  }: IRequest): Promise<Follower[]> {
    const cacheKey = `user-following:${user_id}:${page}:${per_page}`;

    let following = await this.cacheProvider.recoverFromList<Follower>({
      key: cacheKey,
    });

    if (!following) {
      following = await this.followersRepository.getFollowing({
        user_id,
        page: Number(page),
        per_page: Number(per_page),
      });

      if (following.length) {
        await this.cacheProvider.pushToList(cacheKey, following);
      }
    }

    return following;
  }
}

export default ListFollowingUserService;
