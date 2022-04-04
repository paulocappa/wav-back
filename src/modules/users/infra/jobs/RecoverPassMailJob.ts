import { JobsOptions, Job } from 'bullmq';
import { inject, injectable } from 'tsyringe';

import path from 'path';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

import IRecoverPassMailDTO, {
  keyName as RecoverPassMailKey,
} from '@modules/users/dtos/RecoverPassMailDTO';

@injectable()
class RecoverPassMailJob {
  public readonly key: string = RecoverPassMailKey;

  public readonly options: JobsOptions = {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: true,
  };

  constructor(
    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async handle({ data }: Job<IRecoverPassMailDTO>): Promise<void> {
    const { user } = data;

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[Waving] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `http://localhost:3000/reset_password?t=${user.token}`,
        },
      },
    });
  }
}

export default RecoverPassMailJob;
