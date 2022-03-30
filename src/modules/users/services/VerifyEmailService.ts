import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import generateRandomNumber from '@shared/utils/generateRandomNumber';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  email: string;
  code: number;
}

@injectable()
class VerifyEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ email, code }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User not found');
    }

    if (user.code !== code) {
      throw new AppError('Code does not match');
    }

    Object.assign(user, { code: generateRandomNumber(), email_verified: true });

    await this.usersRepository.save(user);
  }
}

export default VerifyEmailService;
