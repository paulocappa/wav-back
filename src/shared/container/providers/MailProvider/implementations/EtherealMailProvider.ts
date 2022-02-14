import { inject, injectable } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      const { user, pass, smtp } = account;
      const { host, port, secure } = smtp;

      this.client = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass,
        },
      });
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const html = await this.mailTemplateProvider.parse(templateData);

    const sentMail = await this.client.sendMail({
      from: {
        name: from?.name || 'Waving.app',
        address: from?.email || 'contato@waving.app',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html,
    });

    console.log(nodemailer.getTestMessageUrl(sentMail));
  }
}

export default EtherealMailProvider;
