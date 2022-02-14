// import User from '../infra/typeorm/schemas/User';
import { IUserModel } from '../infra/mongoose/schemas/User';

import ICreateUserDTO from '../dtos/ICreateUserDTO';

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<IUserModel>;
  save(user: IUserModel): Promise<IUserModel>;
  findById(id: string): Promise<IUserModel | null>;
  findByEmail(email: string): Promise<IUserModel | null>;
  findByUsername(username: string): Promise<IUserModel | null>;
}
