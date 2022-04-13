import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IPublishesRepository from '../repositories/IPublishesRepository';

interface IRequest {
  user_id: string;
  publish_id: string;
}

@injectable()
class DeletePublishService {
  constructor(
    @inject('PublishesRepository')
    private publishesRepository: IPublishesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, publish_id }: IRequest): Promise<void> {
    const publish = await this.publishesRepository.findById(publish_id);

    if (!publish || String(publish.user_id) !== user_id) {
      throw new AppError('Publish not found');
    }

    await this.publishesRepository.delete(publish_id);

    await this.usersRepository.decrementFieldCount(user_id, {
      field: 'count_publishes',
      count: 1,
    });
  }
}

export default DeletePublishService;
