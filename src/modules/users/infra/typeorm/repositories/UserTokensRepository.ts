import { getMongoRepository, MongoRepository } from 'typeorm';
import { ObjectId } from 'bson';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '../schemas/UserToken';

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: MongoRepository<UserToken>;

  constructor() {
    this.ormRepository = getMongoRepository(UserToken);
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user_id: new ObjectId(user_id),
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken> {
    const userToken = await this.ormRepository.findOne({ token });

    return userToken;
  }
}

export default UserTokensRepository;
