import { Module } from '@nestjs/common';
import {
  AppModuleConfigContract,
  MailModuleConfigContract,
} from '@config/AppConfigContracts';
import type { AppModuleOptions } from '@app/types/AppModuleOptions';
import type { MailModuleOptions } from './types/MailModuleOptions';
import { MailProvider } from './types';
import { DummyMailProvider, SmtpProvider } from './providers';
import { MailService } from './MailService';

@Module({
  providers: [
    {
      provide: 'MAIL_PROVIDER',
      inject: [MailModuleConfigContract.token, AppModuleConfigContract.token],
      useFactory: (
        mailConfig: MailModuleOptions,
        appConfig: AppModuleOptions,
      ) => {
        const providerName = mailConfig.provider;
        switch (providerName) {
          case MailProvider.DUMMY:
            return new DummyMailProvider(appConfig);
          case MailProvider.SMTP:
            return new SmtpProvider(mailConfig);
        }
      },
    },
    MailService,
  ],
  exports: [MailService],
})
export class MailModule {}
