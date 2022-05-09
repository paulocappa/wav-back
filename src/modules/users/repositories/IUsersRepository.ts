import User from '../infra/typeorm/schemas/User';

import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IUpdateUserLastAction from '../dtos/IUpdateUserLastAction';
import IIncrementCountUserField from '../dtos/IIncrementCountUserField';
import IDecrementCountUserField from '../dtos/IDecrementCountUserField';
import IIncrementManyUsersCountDTO from '../dtos/IIncrementManyUsersCountDTO';

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
  delete(user_id: string): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  incrementFieldCount(
    user_id: string,
    data: IIncrementCountUserField,
  ): Promise<void>;
  decrementFieldCount(
    user_id: string,
    data: IDecrementCountUserField,
  ): Promise<void>;
  updateUserLastAction(data: IUpdateUserLastAction): Promise<void>;
  incrementManyUsersCount(data: IIncrementManyUsersCountDTO[]): Promise<void>;
  updateUserPushNotifications(
    user_id: string,
    data: User['push_settings'],
  ): Promise<void>;
}
