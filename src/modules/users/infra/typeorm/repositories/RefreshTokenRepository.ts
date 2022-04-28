import IRefreshTokenRepository from '@modules/users/repositories/IRefreshTokenRepository';
import { ObjectId } from 'bson';
import { getMongoRepository, MongoRepository } from 'typeorm';
import RefreshToken from '../schemas/RefreshToken';

class RefreshTokenRepository implements IRefreshTokenRepository {
  private ormRepository: MongoRepository<RefreshToken>;

  constructor() {
    this.ormRepository = getMongoRepository(RefreshToken);
  }

  public async create(user_id: string): Promise<RefreshToken> {
    const refreshToken = this.ormRepository.create({
      user_id: new ObjectId(user_id),
    });

    await this.ormRepository.save(refreshToken);

    return refreshToken;
  }

  public async findById(id: string): Promise<RefreshToken> {
    const refreshToken = await this.ormRepository.findOne({
      where: {
        _id: new ObjectId(id),
      },
    });

    return refreshToken;
  }

  public async findByUserId(user_id: string): Promise<RefreshToken> {
    const refreshToken = await this.ormRepository.findOne({
      user_id: new ObjectId(user_id),
    });

    return refreshToken;
  }

  public async deleteOne(id: string): Promise<void> {
    await this.ormRepository.deleteOne({
      _id: new ObjectId(id),
    });
  }

  public async deleteByUserId(user_id: string): Promise<void> {
    await this.ormRepository.deleteOne({
      user_id: new ObjectId(user_id),
    });
  }
}

export default RefreshTokenRepository;
