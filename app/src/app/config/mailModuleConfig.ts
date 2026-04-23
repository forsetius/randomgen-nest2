import { MailProvider } from '@forsetius/glitnir-mail';
import type { ExternalConfigData } from '../ExternalConfigData';

export function resolveMailModuleConfig(
  configData: Readonly<ExternalConfigData>,
) {
  return {
    provider: configData.MAIL_PROVIDER,
    ...(configData.MAIL_PROVIDER === MailProvider.SMTP && {
      credentials: {
        smtp: {
          host: configData.SMTP_HOST,
          port: configData.SMTP_PORT,
          user: configData.SMTP_USER,
          pass: configData.SMTP_PASSWORD,
        },
      },
    }),
    sender: {
      name: configData.MAIL_SENDER_NAME,
      address: configData.MAIL_SENDER_EMAIL,
    },
  };
}
