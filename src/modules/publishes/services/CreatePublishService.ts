import { ObjectId } from 'bson';
import { inject, injectable } from 'tsyringe';

import Publish from '@modules/publishes/infra/typeorm/schemas/Publish';
import IPublishesRepository from '@modules/publishes/repositories/IPublishesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IFollowersRepository from '@modules/followers/repositories/IFollowersRepository';

import ICreatePublishDTO from '../dtos/ICreatePublishDTO';

interface IRequest {
  user_id: string;
  watermark: boolean;
  text: string | null;
  direct_users: string[];
  filename: string;
  to_world: boolean;
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
  ) {}

  public async execute({
    user_id,
    watermark = false,
    text = null,
    filename,
    direct_users,
    to_world,
  }: IRequest): Promise<Publish> {
    const user = await this.usersRepository.findById(user_id);

    let followersReceivers: ICreatePublishDTO['followers_receivers'] = [];

    const createPublishObject = {
      user_id,
      text,
      watermark,
      location: user.location,
      to_world,
      file: filename,
    } as ICreatePublishDTO;

    if (to_world) {
      const followers = await this.followersRepository.getAllFollowers(
        user_id,
        direct_users,
      );

      followersReceivers = followers.map(follower => ({
        user_id: new ObjectId(follower.user_id),
        created_at: new Date(),
        reaction: null,
        seen: false,
        seen_at: null,
      }));

      Object.assign(createPublishObject, {
        range: user.range,
        followers_receivers: followersReceivers,
      });
    }

    const parsedDirect = direct_users.map(userId => ({
      user_id: new ObjectId(userId),
      created_at: new Date(),
      reaction: null,
      seen: false,
      seen_at: null,
    }));

    Object.assign(createPublishObject, {
      direct_receivers: parsedDirect,
    });

    const publish = await this.publishesRepository.create(createPublishObject);

    await this.usersRepository.incrementFieldCount(user_id, {
      field: 'count_publishes',
      count: 1,
    });

    return publish;
  }
}

export default CreatePublishService;
