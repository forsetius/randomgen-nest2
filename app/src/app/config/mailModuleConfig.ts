import { EnvVarSchemaType } from '@config/EnvVarSchema';
import { MailModuleOptions } from '../../io/mail/types/MailModuleOptions';
import { MailProvider } from '../../io/mail/types';
import { registerAsTyped } from '@config/registerAsTyped';

export default (envVars: EnvVarSchemaType) =>
  registerAsTyped(
    'mail',
    () =>
      ({
        provider: envVars.MAIL_PROVIDER,
        credentials: {
          ...(envVars.MAIL_PROVIDER === MailProvider.SMTP && {
            smtp: {
              host: envVars.SMTP_HOST,
              port: envVars.SMTP_PORT,
              user: envVars.SMTP_USER,
              pass: envVars.SMTP_PASSWORD,
            },
          }),
        },
        sender: {
          name: envVars.MAIL_SENDER_NAME,
          address: envVars.MAIL_SENDER_EMAIL,
        },
        adminEmail: 'forseti@forseti.pl',
      }) satisfies MailModuleOptions,
  );
