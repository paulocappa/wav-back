import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

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

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
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

    const cacheKey = `publish-receivers-seen:${publish_id}:${page}:${per_page}`;

    let receivers = await this.cacheProvider.recover<Publish>(cacheKey);

    if (!receivers) {
      receivers = await this.publishesRepository.listReceiversSeen({
        user_id,
        publish_id,
        page,
        per_page,
      });

      await this.cacheProvider.save(cacheKey, receivers);
    }

    return receivers;
  }
}

export default ListPublishReceiversSeenService;
