import z from 'zod';
import { Env } from '@shared/types/Env';
import { MailProvider } from '../../io/mail/types';
import { projectDirSchema } from '@shared/validation/zodSchemas/projectDirSchema';

const MIN_PORT_NUMBER = 0;
const MAX_PORT_NUMBER = 65535;

const BaseEnvVarSchema = z.object({
  ENV: z.enum(Env),
  AKISMET_KEY: z.string().nonempty(),
  APP_HOST: z.httpUrl({ normalize: true }).or(z.literal('localhost')),
  APP_PORT: z.coerce.number().int().min(MIN_PORT_NUMBER).max(MAX_PORT_NUMBER),
  CMS_SOURCE_DIR: projectDirSchema,
  SCENGEN_SOURCE_DIR: projectDirSchema,
});

const MailProviderSchema = z.discriminatedUnion('MAIL_PROVIDER', [
  z.object({
    MAIL_PROVIDER: z.literal(MailProvider.DUMMY),
    MAIL_SENDER_NAME: z.string(),
    MAIL_SENDER_EMAIL: z.string(),
  }),
  z.object({
    MAIL_PROVIDER: z.literal(MailProvider.SMTP),
    MAIL_SENDER_NAME: z.string().nonempty(),
    MAIL_SENDER_EMAIL: z.email(),
    SMTP_HOST: z.string().nonempty(),
    SMTP_PORT: z.coerce
      .number()
      .int()
      .min(MIN_PORT_NUMBER)
      .max(MAX_PORT_NUMBER),
    SMTP_USER: z.string().nonempty(),
    SMTP_PASSWORD: z.string().nonempty(),
  }),
]);

export const EnvVarSchema = BaseEnvVarSchema.and(MailProviderSchema);

export type EnvVarSchemaType = z.infer<typeof EnvVarSchema>;
