import ICreatePublishDTO from '../dtos/ICreatePublishDTO';
import IListRecentPublishesDTO from '../dtos/IListRecentPublishesDTO';
import IUpdatePublishSeenDTO from '../dtos/IUpdatePublishSeenDTO';

import Publish from '../infra/typeorm/schemas/Publish';

export default interface IPublishesRepository {
  create(data: ICreatePublishDTO): Promise<Publish>;
  findById(publish_id: string): Promise<Publish | null>;
  findByUserAndPublishId(
    user_id: string,
    publish_id: string,
  ): Promise<Publish | null>;
  delete(publish_id: string): Promise<void>;
  updateSeen(
    data: IUpdatePublishSeenDTO,
  ): Promise<Record<string, { views: number; reactions: number }>>;
  listRecentPublishes(data: IListRecentPublishesDTO): Promise<Publish[]>;
}
