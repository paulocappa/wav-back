import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/schemas/User';

interface IRequest {
  user_id: string;
  coordinates: [number, number];
}

@injectable()
class UpdateUsersLocationService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id, coordinates }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found!');
    }

    Object.assign(user, {
      location: {
        type: 'Point',
        coordinates,
      },
    });

    await this.usersRepository.save(user);

    await this.cacheProvider.invalidate(`user-info:${user_id}`);

    return user;
  }
}

export default UpdateUsersLocationService;
