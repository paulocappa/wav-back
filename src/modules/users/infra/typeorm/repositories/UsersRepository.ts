import { getMongoRepository, MongoRepository } from 'typeorm';
import { ObjectId } from 'bson';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IDeAndIncrementCountUserDTO from '@modules/users/dtos/IDeAndIncrementCountUserDTO';

import User from '../schemas/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: MongoRepository<User>;

  constructor() {
    this.ormRepository = getMongoRepository(User);
  }

  get userOrmRepository(): MongoRepository<User> {
    return this.ormRepository;
  }

  public async create({
    email,
    username,
    name,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      email,
      name,
      username,
      password,
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    await this.ormRepository.save(user);

    return user;
  }

  public async findById(id: string): Promise<User | null> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.ormRepository.findOne({ where: { email } });

    return user;
  }

  public async findByUsername(username: string): Promise<User | null> {
    const user = await this.ormRepository.findOne({ username });

    return user;
  }

  public async delete(user_id: string): Promise<void> {
    await this.ormRepository.deleteOne(new ObjectId(user_id));
  }

  public async incrementFollowersCount({
    user_id,
    count = 1,
  }: IDeAndIncrementCountUserDTO): Promise<void> {
    await this.ormRepository.updateOne(
      {
        _id: new ObjectId(user_id),
      },
      {
        $inc: {
          count_followers: count,
        },
      },
    );
  }

  public async incrementFollowingCount({
    user_id,
    count = 1,
  }: IDeAndIncrementCountUserDTO): Promise<void> {
    await this.ormRepository.updateOne(
      {
        _id: new ObjectId(user_id),
      },
      {
        $inc: {
          count_following: count,
        },
      },
    );
  }

  public async decrementFollowersCount({
    user_id,
    count = 1,
  }: IDeAndIncrementCountUserDTO): Promise<void> {
    await this.ormRepository.updateOne(
      {
        _id: new ObjectId(user_id),
      },
      {
        $inc: {
          count_followers: -count,
        },
      },
    );
  }

  public async decrementFollowingCount({
    user_id,
    count = 1,
  }: IDeAndIncrementCountUserDTO): Promise<void> {
    await this.ormRepository.updateOne(
      {
        _id: new ObjectId(user_id),
      },
      {
        $inc: {
          count_following: -count,
        },
      },
    );
  }
}

export default UsersRepository;
