import { MongoRepository } from 'typeorm';

import User from '../infra/typeorm/schemas/User';

import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IDeAndIncrementCountUserDTO from '../dtos/IDeAndIncrementCountUserDTO';

export default interface IUsersRepository {
  get userOrmRepository(): MongoRepository<User>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  incrementFollowersCount(data: IDeAndIncrementCountUserDTO): Promise<void>;
  incrementFollowingCount(data: IDeAndIncrementCountUserDTO): Promise<void>;
  decrementFollowersCount(data: IDeAndIncrementCountUserDTO): Promise<void>;
  decrementFollowingCount(data: IDeAndIncrementCountUserDTO): Promise<void>;
  delete(user_id: string): Promise<void>;
}
