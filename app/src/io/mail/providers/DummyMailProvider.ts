import { Injectable } from '@nestjs/common';
import { MailProviderData, MailProviderInterface } from '../types';
import { AppConfigService } from '@config/AppConfigService';
import { Env } from '@shared/types/Env';

@Injectable()
export class DummyMailProvider implements MailProviderInterface {
  constructor(private configService: AppConfigService) {}

  async send({ from, to, subject, text }: MailProviderData): Promise<void> {
    if (this.configService.getInferred('app.env') !== Env.TEST) {
      console.info(
        `Dummy call to send an email as ${from.name}<${from.address}> to ${[to].flat().join(', ')}:`,
      );
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${text}`);
    }

    return Promise.resolve();
  }
}
