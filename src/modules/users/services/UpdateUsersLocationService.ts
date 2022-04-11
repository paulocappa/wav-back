import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '../repositories/IUsersRepository';

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

  public async execute({ user_id, coordinates }: IRequest): Promise<void> {
    await this.usersRepository.updateUserLastAction({
      user_id,
      coordinates,
    });

    await this.cacheProvider.invalidate(`user-info:${user_id}`);
  }
}

export default UpdateUsersLocationService;
