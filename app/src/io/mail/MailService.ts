import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import type { MailProviderData, MailProviderInterface } from './types';

@Injectable()
export class MailService {
  public constructor(
    @Inject('MAIL_PROVIDER') private mailProvider: MailProviderInterface,
  ) {}

  public async sendMail(mailData: MailProviderData) {
    try {
      await this.mailProvider.send(mailData);
    } catch (e) {
      throw new BadGatewayException(
        `Could not send an email. ${e instanceof Error ? e.message : ''}`,
      );
    }
  }
}
