import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import type { ListType } from '../dtos/IListRecentPublishesDTO';

import Publish from '../infra/typeorm/schemas/Publish';
import IPublishesRepository from '../repositories/IPublishesRepository';

interface IRequest {
  user_id: string;
  list_type: ListType;
  page: number;
  per_page: number;
}

@injectable()
class ListTimelinePublishesService {
  constructor(
    @inject('PublishesRepository')
    private publishesRepository: IPublishesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
    list_type,
    page,
    per_page,
  }: IRequest): Promise<Publish[]> {
    const cacheKey = `${list_type}-timeline:${user_id}:${page}:${per_page}`;

    let publishes = await this.cacheProvider.recoverFromList<Publish>({
      key: cacheKey,
      fromIndex: page - 1,
      total: per_page,
    });

    if (!publishes || !publishes.length) {
      publishes = await this.publishesRepository.listRecentPublishes({
        user_id,
        list_type,
        page,
        per_page,
      });

      if (publishes.length) {
        await this.cacheProvider.pushToList(cacheKey, publishes);
      }
    }

    return publishes;
  }
}

export default ListTimelinePublishesService;
