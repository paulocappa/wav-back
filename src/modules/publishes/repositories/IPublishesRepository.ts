import ICreatePublishDTO from '../dtos/ICreatePublishDTO';
import IListRecentPublishesDTO from '../dtos/IListRecentPublishesDTO';

import Publish from '../infra/typeorm/schemas/Publish';

export default interface IPublishesRepository {
  create(data: ICreatePublishDTO): Promise<Publish>;
  findById(publish_id: string): Promise<Publish | null>;
  delete(publish_id: string): Promise<void>;
  listRecentPublishes(data: IListRecentPublishesDTO): Promise<Publish[]>;
}
