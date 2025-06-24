import { EnvVarValidator } from '@config/EnvVarValidator';
import { Lang } from '@shared/types/Lang';
import { MailProvider } from './io/mail/types';

export const config = (envVars: EnvVarValidator) => ({
  app: {
    title: 'RandomGen',
    description: 'Random generators for RPGs',
    version: '1.0',
    env: envVars.ENV,
    host: envVars.APP_HOST,
    port: envVars.APP_PORT,
    defaultLanguage: Lang.EN,
  },
  business: {
    technobabble: {
      maxResults: 20,
    },
  },
  mail: {
    provider: MailProvider.SMTP,
    credentials: {
      smtp: {
        host: envVars.SMTP_HOST,
        port: envVars.SMTP_PORT,
        user: envVars.SMTP_USER,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    sender: {
      name: envVars.MAIL_SENDER_NAME,
      address: envVars.MAIL_SENDER_EMAIL,
    },
    adminEmail: 'forseti@forseti.pl',
  },
  security: {
    akismet: {
      key: envVars.AKISMET_KEY,
      siteUrl: envVars.APP_HOST,
    },
    rateLimit: {
      limit: 100,
      windowMs: 1000,
    },
  },
});
