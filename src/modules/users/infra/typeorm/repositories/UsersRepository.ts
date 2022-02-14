import { getMongoRepository, MongoRepository } from 'typeorm';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '../schemas/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: MongoRepository<User>;

  constructor() {
    this.ormRepository = getMongoRepository(User);
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
}

export default UsersRepository;
