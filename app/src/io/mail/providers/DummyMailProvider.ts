import { Injectable } from '@nestjs/common';
import { MailProviderData, MailProviderInterface } from '../types';
import { Env } from '@shared/types/Env';
import type { AppModuleOptions } from '@app/types/AppModuleOptions';

@Injectable()
export class DummyMailProvider implements MailProviderInterface {
  constructor(private readonly appConfig: Pick<AppModuleOptions, 'env'>) {}

  async send({ from, to, subject, text }: MailProviderData): Promise<void> {
    if (this.appConfig.env !== Env.TEST) {
      console.info(
        `Dummy call to send an email as ${from.name}<${from.address}> to ${[to].flat().join(', ')}:`,
      );
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${text}`);
    }

    return Promise.resolve();
  }
}
