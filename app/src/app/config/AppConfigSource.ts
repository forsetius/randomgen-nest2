import fs from 'node:fs';
import { MailProvider } from '@forsetius/glitnir-mail';
import {
  isInsideProject,
  resolveAppRelativePath,
} from '@forsetius/glitnir-shared';
import { z } from 'zod';
import { APP_ROOT } from '../../appRoot';
import { Env } from '@shared/types/Env';
import { InvalidEnvVarsException } from './exceptions/InvalidEnvVarsException';

const MIN_PORT_NUMBER = 0;
const MAX_PORT_NUMBER = 65535;

const BaseAppConfigSourceSchema = z.object({
  ENV: z.enum(Env),
  AKISMET_KEY: z.string().nonempty(),
  APP_HOST: z.httpUrl({ normalize: true }).or(z.literal('localhost')),
  APP_PORT: z.coerce.number().int().min(MIN_PORT_NUMBER).max(MAX_PORT_NUMBER),
  CMS_SOURCE_DIR: z
    .string()
    .min(1)
    .transform((rawPath: string) => resolveAppRelativePath(APP_ROOT, rawPath))
    .refine((absolutePath: string) => isInsideProject(APP_ROOT, absolutePath), {
      message: 'Directory must be inside project root',
    })
    .refine(
      (absolutePath: string) => {
        try {
          fs.accessSync(absolutePath, fs.constants.R_OK);
          return fs.statSync(absolutePath).isDirectory();
        } catch {
          return false;
        }
      },
      { message: 'No such directory' },
    ),
});

const MailProviderSchema = z.discriminatedUnion('MAIL_PROVIDER', [
  z.object({
    MAIL_PROVIDER: z.literal(MailProvider.DUMMY),
    MAIL_SENDER_NAME: z.string().nonempty(),
    MAIL_SENDER_EMAIL: z.email(),
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

// FIXME nomenklatura
export const AppConfigSourceSchema =
  BaseAppConfigSourceSchema.and(MailProviderSchema);

export type AppConfigSource = z.infer<typeof AppConfigSourceSchema>;
type RawConfigSource = Readonly<Record<string, string | undefined>>;

export function resolveAppConfigSource(
  rawSource: RawConfigSource,
): AppConfigSource {
  try {
    return AppConfigSourceSchema.parse(rawSource);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new InvalidEnvVarsException(error); // FIXME wyjątek z pakietu
    }

    throw error; // FIXME stringify error
  }
}
