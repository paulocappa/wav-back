import { ObjectId } from 'bson';
import { inject, injectable } from 'tsyringe';

import Publish from '@modules/publishes/infra/typeorm/schemas/Publish';
import IPublishesRepository from '@modules/publishes/repositories/IPublishesRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IFollowersRepository from '@modules/followers/repositories/IFollowersRepository';

interface IRequest {
  user_id: string;
  watermark: boolean;
  text: string;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  direct_users: string[];
  publishFilename: string;
}

@injectable()
class CreatePublishService {
  constructor(
    @inject('PublishesRepository')
    private publishesRepository: IPublishesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('FollowersRepository')
    private followersRepository: IFollowersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    location,
    watermark = false,
    text,
    publishFilename,
    direct_users,
  }: IRequest): Promise<Publish> {
    const user = await this.usersRepository.findById(user_id);

    const followers = await this.followersRepository.getAllFollowers(user_id);

    const filename = await this.storageProvider.saveFile(publishFilename);

    const parsedFollowers = followers.map(follower => ({
      user_id: new ObjectId(follower.user_id),
      created_at: new Date(),
      reaction: null,
      seen: false,
      seen_at: null,
    }));

    const parsedDirect = direct_users.map(userId => ({
      user_id: new ObjectId(userId),
      created_at: new Date(),
      reaction: null,
      seen: false,
      seen_at: null,
    }));

    const publish = await this.publishesRepository.create({
      user_id,
      followers_receivers: parsedFollowers,
      direct_receivers: parsedDirect,
      range: user.range,
      text,
      watermark,
      file: filename,
      location,
    });

    return publish;
  }
}

export default CreatePublishService;
