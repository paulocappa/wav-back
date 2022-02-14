import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/schemas/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    name,
    email,
    username,
    password,
  }: IRequest): Promise<User> {
    const emailInUse = await this.usersRepository.findByEmail(email);

    if (emailInUse) {
      throw new AppError('This email is alredy in use');
    }

    const usernameInUse = await this.usersRepository.findByUsername(username);

    if (usernameInUse) {
      throw new AppError('This username is alredy in use');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
