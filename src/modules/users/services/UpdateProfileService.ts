import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/schemas/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  username: string;
  email: string;
  old_password?: string;
  new_password?: string;
  confirm_password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    username,
    email,
    old_password,
    new_password,
    confirm_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const userWithEmail = await this.usersRepository.findByEmail(email);

    if (userWithEmail && String(userWithEmail.id) !== user_id) {
      throw new AppError('Email alredy in use');
    }

    const userWithUsername = await this.usersRepository.findByUsername(
      username,
    );

    if (userWithUsername && String(userWithUsername.id) !== user_id) {
      throw new AppError('Username alredy in use');
    }

    Object.assign(user, { name, email, username });

    if (new_password && !old_password) {
      throw new AppError('You need to provide the old password');
    }

    if (old_password && !new_password) {
      throw new AppError('You need to provide the new password');
    }

    if (old_password && new_password && !confirm_password) {
      throw new AppError('You need to provide the confirm password');
    }

    if (old_password && new_password && new_password !== confirm_password) {
      throw new AppError('New password and confirm password does not match');
    }

    if (old_password && new_password && confirm_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password does not match');
      }

      user.password = await this.hashProvider.generateHash(new_password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
