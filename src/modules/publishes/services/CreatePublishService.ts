import { inject, injectable } from 'tsyringe';

import Publish from '@modules/publishes/infra/typeorm/schemas/Publish';
import IPublishesRepository from '@modules/publishes/repositories/IPublishesRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import { IReceivers } from '../dtos/ICreatePublishDTO';

interface IRequest {
  user_id: string;
  watermark: boolean;
  text: string;
  coordinates: number[];
  publishFilename: string;
  receivers: IReceivers[];
}

@injectable()
class CreatePublishService {
  constructor(
    @inject('PublishesRepository')
    private publishesRepository: IPublishesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    coordinates,
    receivers,
    watermark = false,
    text,
    publishFilename,
  }: IRequest): Promise<Publish> {
    const user = await this.usersRepository.findById(user_id);

    const filename = await this.storageProvider.saveFile(publishFilename);

    const publish = await this.publishesRepository.create({
      user_id,
      receivers,
      text,
      watermark,
      file: filename,
      coordinates,
    });

    return publish;
  }
}

export default CreatePublishService;
