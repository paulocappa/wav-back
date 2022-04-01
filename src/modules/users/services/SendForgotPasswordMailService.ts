import { inject, injectable } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordMailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User not found');
    }

    const { token } = await this.userTokensRepository.generate(String(user.id));

    const { name } = user;

    await this.queueProvider.add('RecoverPassMail', {
      user: { email, name, token },
    });
  }
}

export default SendForgotPasswordMailService;
