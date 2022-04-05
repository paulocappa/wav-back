import ICreatePublishDTO from '@modules/publishes/dtos/ICreatePublishDTO';
import IPublishesRepository from '@modules/publishes/repositories/IPublishesRepository';
import { ObjectId } from 'bson';
import { getMongoRepository, MongoRepository } from 'typeorm';
import Publish from '../schemas/Publish';

class PublishesRepository implements IPublishesRepository {
  private ormRepository: MongoRepository<Publish>;

  constructor() {
    this.ormRepository = getMongoRepository(Publish);
  }

  public async create({
    user_id,
    text,
    watermark,
    receivers,
    coordinates,
    file,
  }: ICreatePublishDTO): Promise<Publish> {
    const parsedReceivers = receivers.map(receiver => ({
      ...receiver,
      user_id: new ObjectId(receiver.user_id),
    }));

    const publish = this.ormRepository.create({
      user_id: new ObjectId(user_id),
      receivers: parsedReceivers,
      text,
      watermark,
      file,
      location: {
        type: 'Point',
        coordinates,
      },
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
