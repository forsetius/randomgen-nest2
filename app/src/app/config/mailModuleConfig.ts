import { MailProvider } from '@forsetius/glitnir-mail';
import type { AppConfigSource } from './AppConfigSource';

export function resolveMailModuleConfig(source: Readonly<AppConfigSource>) {
  return {
    provider: source.MAIL_PROVIDER,
    ...(source.MAIL_PROVIDER === MailProvider.SMTP && {
      credentials: {
        smtp: {
          host: source.SMTP_HOST,
          port: source.SMTP_PORT,
          user: source.SMTP_USER,
          pass: source.SMTP_PASSWORD,
        },
      },
    }),
    sender: {
      name: source.MAIL_SENDER_NAME,
      address: source.MAIL_SENDER_EMAIL,
    },
  };
}
