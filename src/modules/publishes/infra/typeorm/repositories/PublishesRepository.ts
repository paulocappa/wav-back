import { ObjectId } from 'bson';
import { getMongoRepository, MongoRepository } from 'typeorm';

import ICreatePublishDTO from '@modules/publishes/dtos/ICreatePublishDTO';
import IPublishesRepository from '@modules/publishes/repositories/IPublishesRepository';

import Publish from '../schemas/Publish';

interface IGeometryPublish {
  type: 'Point';
  coordinates: [number, number];
}

class PublishesRepository implements IPublishesRepository {
  private ormRepository: MongoRepository<Publish>;

  constructor() {
    this.ormRepository = getMongoRepository(Publish);
  }

  public async create({
    user_id,
    text,
    watermark,
    followers_receivers,
    direct_receivers,
    location,
    range,
    file,
    to_world,
  }: ICreatePublishDTO): Promise<Publish> {
    const publishLocation = location
      ? { type: 'Point', coordinates: [location.longitude, location.latitude] }
      : null;

    const publish = this.ormRepository.create({
      user_id: new ObjectId(user_id),
      text,
      watermark,
      file,
      followers_receivers,
      direct_receivers,
      range,
      location: publishLocation as IGeometryPublish | null,
      to_world,
    });

    await this.ormRepository.save(publish);

    return publish;
  }

  public async findById(publish_id: string): Promise<Publish> {
    const publish = await this.ormRepository.findOne(publish_id);

    return publish;
  }

  public async delete(publish_id: string): Promise<void> {
    await this.ormRepository.delete(publish_id);
  }
}

export default PublishesRepository;
