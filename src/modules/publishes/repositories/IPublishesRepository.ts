import ICreatePublishDTO from '../dtos/ICreatePublishDTO';
import IListReceiversSeenDTO from '../dtos/IListReceiversSeenDTO';
import IListRecentPublishesDTO from '../dtos/IListRecentPublishesDTO';
import IUpdatePublishSeenDTO from '../dtos/IUpdatePublishSeenDTO';

import Publish from '../infra/typeorm/schemas/Publish';

export interface IUpdateSeenResponse {
  publishes: Publish[];
  counter: {
    views: number;
    reactions: number;
  };
}

export default interface IPublishesRepository {
  create(data: ICreatePublishDTO): Promise<Publish>;
  findById(publish_id: string): Promise<Publish | null>;
  findByUserAndPublishId(
    user_id: string,
    publish_id: string,
  ): Promise<Publish | null>;
  delete(publish_id: string): Promise<void>;
  updateSeen(data: IUpdatePublishSeenDTO): Promise<IUpdateSeenResponse>;
  listRecentPublishes(data: IListRecentPublishesDTO): Promise<Publish[]>;
  listReceiversSeen(data: IListReceiversSeenDTO): Promise<Publish>;
}
