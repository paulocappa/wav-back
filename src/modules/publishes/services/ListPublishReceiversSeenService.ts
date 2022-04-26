import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import Publish from '../infra/typeorm/schemas/Publish';
import IPublishesRepository from '../repositories/IPublishesRepository';

interface IRequest {
  user_id: string;
  publish_id: string;
  page: number;
  per_page: number;
}

@injectable()
class ListPublishReceiversSeenService {
  constructor(
    @inject('PublishesRepository')
    private publishesRepository: IPublishesRepository,
  ) {}

  public async execute({
    user_id,
    publish_id,
    page,
    per_page,
  }: IRequest): Promise<Publish> {
    const publish = await this.publishesRepository.findByUserAndPublishId(
      user_id,
      publish_id,
    );

    if (!publish) {
      throw new AppError('Publish not found');
    }

    const receivers = await this.publishesRepository.listReceiversSeen({
      user_id,
      publish_id,
      page,
      per_page,
    });

    console.log(receivers);

    return receivers;
  }
}

export default ListPublishReceiversSeenService;
