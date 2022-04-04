import { JobsOptions, Job } from 'bullmq';
import { inject, injectable } from 'tsyringe';

import path from 'path';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

import IRegistrationMailDTO, {
  keyName as RegistrationMailKey,
} from '@modules/users/dtos/RegistrationMailDTO';

@injectable()
class RegistrationMailJob {
  public readonly key: string = RegistrationMailKey;

  public readonly options: JobsOptions = {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: true,
  };

  constructor(
    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async handle({ data }: Job<IRegistrationMailDTO>): Promise<void> {
    const { user } = data;

    const registrationTemplate = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'registration.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[Waving] Registro de conta',
      templateData: {
        file: registrationTemplate,
        variables: {
          name: user.name,
          code: user.code,
        },
      },
    });
  }
}

export default RegistrationMailJob;
