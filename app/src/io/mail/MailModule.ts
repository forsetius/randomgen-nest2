import { Module } from '@nestjs/common';
import { AppConfigService } from '@config/AppConfigService';
import { MailProvider } from './types';
import { DummyMailProvider, SmtpProvider } from './providers';
import { MailService } from './MailService';

@Module({
  providers: [
    {
      provide: 'MAIL_PROVIDER',
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        const providerName = configService.getInferred('mail.provider');
        switch (providerName) {
          case MailProvider.DUMMY:
            return new DummyMailProvider(configService);
          case MailProvider.SMTP:
            return new SmtpProvider(configService);
        }
      },
    },
    MailService,
  ],
  exports: [MailService],
})
export class MailModule {}
