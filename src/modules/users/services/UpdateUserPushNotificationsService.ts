import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/schemas/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  data: Partial<User['push_settings']>;
}

@injectable()
class UpdateUserPushNotificationsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, data }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const currentPushSettings = user.push_settings;

    Object.assign(currentPushSettings, data);

    await this.usersRepository.updateUserPushNotifications(
      user_id,
      currentPushSettings,
    );

    return user;
  }
}

export default UpdateUserPushNotificationsService;
