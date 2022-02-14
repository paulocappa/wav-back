import { v4 as uuid } from 'uuid';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '@modules/users/infra/typeorm/schemas/User';

import IUsersRepository from '../IUsersRepository';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async create({
    email,
    name,
    username,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid(), name, email, username, password });

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const userIndex = this.users.findIndex(findUser => findUser === user);

    this.users[userIndex] = user;

    return user;
  }

  public async findById(id: string): Promise<User> {
    const findedUser = this.users.find(user => String(user.id) === id);

    return findedUser;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const findedUser = this.users.find(user => user.email === email);

    return findedUser;
  }

  public async findByUsername(username: string): Promise<User> {
    const findedUser = this.users.find(user => user.username === username);

    return findedUser;
  }
}

export default FakeUsersRepository;
