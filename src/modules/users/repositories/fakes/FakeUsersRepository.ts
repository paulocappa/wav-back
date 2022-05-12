import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '@modules/users/infra/typeorm/schemas/User';

import IIncrementManyUsersCountDTO from '@modules/users/dtos/IIncrementManyUsersCountDTO';
import IDecrementCountUserField from '@modules/users/dtos/IDecrementCountUserField';
import IIncrementCountUserField from '@modules/users/dtos/IIncrementCountUserField';
import { ObjectId } from 'bson';
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

    Object.assign(user, {
      id: new ObjectId(),
      name,
      email,
      username,
      password,
    });

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

  public async delete(user_id: string): Promise<void> {
    const userIndex = this.users.findIndex(user => String(user.id) === user_id);

    this.users.splice(userIndex, 1);
  }

  public async incrementManyUsersCount(
    data: IIncrementManyUsersCountDTO[],
  ): Promise<void> {
    data.forEach(el => {
      const user = this.users.find(u => String(u.id) === el.user_id);
      const userIndex = this.users.findIndex(u => String(u.id) === el.user_id);

      el.fieldsToUpdate.forEach(({ field, count }) => {
        user[field] += count;
      });

      this.users[userIndex] = user;
    });
  }

  public async decrementFieldCount(
    user_id: string,
    { field, count = 1 }: IDecrementCountUserField,
  ): Promise<void> {
    const user = this.users.find(u => String(u.id) === user_id);
    const userIndex = this.users.findIndex(u => String(u.id) === user_id);

    user[field] -= count;

    this.users[userIndex] = user;
  }

  public async incrementFieldCount(
    user_id: string,
    { field, count = 1 }: IIncrementCountUserField,
  ): Promise<void> {
    const user = this.users.find(u => String(u.id) === user_id);
    const userIndex = this.users.findIndex(u => String(u.id) === user_id);

    user[field] += count;

    this.users[userIndex] = user;
  }
}

export default FakeUsersRepository;
