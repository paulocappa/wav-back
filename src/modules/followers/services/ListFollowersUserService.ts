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
class ListFollowersUserService {
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
    const cacheKey = `user-followers:${user_id}:${page}:${per_page}`;

    let followers = await this.cacheProvider.recoverFromList<Follower>({
      key: cacheKey,
      fromIndex: Number(page) - 1,
      total: Number(per_page),
    });

    if (!followers) {
      followers = await this.followersRepository.getFollowers({
        user_id,
        page: Number(page),
        per_page: Number(per_page),
      });

      if (followers.length) {
        await this.cacheProvider.pushToList(cacheKey, followers);
      }
    }

    return followers;
  }
}

export default ListFollowersUserService;
