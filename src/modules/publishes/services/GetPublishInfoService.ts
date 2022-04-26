import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Publish from '../infra/typeorm/schemas/Publish';
import IPublishesRepository from '../repositories/IPublishesRepository';

interface IRequest {
  user_id: string;
  publish_id: string;
}

@injectable()
class GetPublishInfoService {
  constructor(
    @inject('PublishesRepository')
    private publishesRepository: IPublishesRepository,
  ) {}

  public async execute({ user_id, publish_id }: IRequest): Promise<Publish> {
    const publish = await this.publishesRepository.findByUserAndPublishId(
      user_id,
      publish_id,
    );

    if (!publish) {
      throw new AppError('Publish not found!');
    }

    return publish;
  }
}

export default GetPublishInfoService;
