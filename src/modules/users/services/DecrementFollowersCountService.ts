import { ObjectId } from 'bson';
import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class DecrementFollowersCountService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(user_id: string): Promise<void> {
    const ormRepository = this.usersRepository.userOrmRepository;

    await ormRepository.updateOne(
      {
        _id: new ObjectId(user_id),
      },
      {
        $inc: {
          count_followers: -1,
        },
      },
    );

    await this.cacheProvider.invalidate(`user-info:${user_id}`);
  }
}

export default DecrementFollowersCountService;
