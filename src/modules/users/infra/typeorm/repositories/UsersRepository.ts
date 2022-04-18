import { getMongoRepository, MongoRepository } from 'typeorm';
import { ObjectId } from 'bson';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import IUpdateUserLastAction from '@modules/users/dtos/IUpdateUserLastAction';
import IIncrementCountUserField from '@modules/users/dtos/IIncrementCountUserField';
import IDecrementCountUserField from '@modules/users/dtos/IDecrementCountUserField';
import IIncrementManyUsersCountDTO from '@modules/users/dtos/IIncrementManyUsersCountDTO';
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

  public async incrementFieldCount(
    user_id: string,
    { field, count = 1 }: IIncrementCountUserField,
  ): Promise<void> {
    await this.ormRepository.updateOne(
      {
        _id: new ObjectId(user_id),
      },
      {
        $inc: {
          [field]: count,
        },
      },
    );
  }

  public async decrementFieldCount(
    user_id: string,
    { field, count = 1 }: IDecrementCountUserField,
  ): Promise<void> {
    await this.ormRepository.updateOne(
      {
        _id: new ObjectId(user_id),
      },
      {
        $inc: {
          [field]: -count,
        },
      },
    );
  }

  public async updateUserLastAction({
    user_id,
    coordinates,
  }: IUpdateUserLastAction): Promise<void> {
    await this.ormRepository.updateOne(
      {
        _id: new ObjectId(user_id),
      },
      {
        $set: {
          location: {
            type: 'Point',
            coordinates,
          },
        },
      },
    );
  }

  public async incrementManyUsersCount(
    data: IIncrementManyUsersCountDTO[],
  ): Promise<void> {
    const formattedData = data.map(el => {
      const incFields: Record<string, number> = {};

      el.fieldsToUpdate.forEach(({ field, count }) => {
        incFields[field] = count;
      });

      return {
        updateOne: {
          filter: {
            _id: new ObjectId(el.user_id),
          },
          update: {
            $inc: incFields,
          },
        },
      };
    });

    await this.ormRepository.bulkWrite(formattedData);
  }
}

export default UsersRepository;
