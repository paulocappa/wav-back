import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/schemas/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id: string;
}

@injectable()
class GetUserInfoService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    let user = await this.cacheProvider.recover<User>(`user-info:${user_id}`);

    if (!user) {
      user = await this.usersRepository.findById(user_id);

      await this.cacheProvider.save<User>(`user-info:${user_id}`, user);
    }

    return user;
  }
}

export default GetUserInfoService;
