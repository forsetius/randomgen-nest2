import fs from 'node:fs';
import { MailProvider } from '@forsetius/glitnir-mail';
import {
  isInsideProject,
  resolveAppRelativePath,
  stringifyError,
} from '@forsetius/glitnir-shared';
import { z } from 'zod';
import { APP_ROOT } from '../appConstants';
import {
  MAX_PORT_NUMBER,
  MIN_PORT_NUMBER,
  MIN_TRANSPORT_PORT_NUMBER,
} from '../shared/constants/ConfigConstants';
import { Env } from '../shared/types/Env';
import { InvalidRawConfigDataError } from './exceptions/InvalidRawConfigDataError';

const SharedExternalConfigDataSchema = z.object({
  ENV: z.enum(Env),
  AKISMET_KEY: z.string().nonempty(),
  APP_HOST: z.httpUrl({ normalize: true }).or(z.literal('localhost')),
  APP_PORT: z.coerce.number().int().min(MIN_PORT_NUMBER).max(MAX_PORT_NUMBER),
  CMS_SOURCE_DIR: z
    .string()
    .min(1)
    .transform((rawPath: string) => resolveAppRelativePath(APP_ROOT, rawPath))
    .refine((absolutePath: string) => isInsideProject(APP_ROOT, absolutePath), {
      error: 'Directory must be inside project root',
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
      { error: 'No such directory' },
    ),
});

const MailConfigDataSchema = z.discriminatedUnion('MAIL_PROVIDER', [
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
      .min(MIN_TRANSPORT_PORT_NUMBER)
      .max(MAX_PORT_NUMBER),
    SMTP_USER: z.string().nonempty(),
    SMTP_PASSWORD: z.string().nonempty(),
  }),
]);

export const ExternalConfigDataSchema =
  SharedExternalConfigDataSchema.and(MailConfigDataSchema);

export type RawExternalConfigData = Readonly<
  Record<string, string | undefined>
>;
export type ExternalConfigData = z.infer<typeof ExternalConfigDataSchema>;

export function parseConfigData(
  rawExternalConfigData: RawExternalConfigData,
): ExternalConfigData {
  try {
    return ExternalConfigDataSchema.parse(rawExternalConfigData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new InvalidRawConfigDataError(
        `Invalid raw config data:\n${z.prettifyError(error)}`,
        error,
      );
    }

    throw new InvalidRawConfigDataError(
      `Could not parse raw config data. Reason: ${stringifyError(error)}`,
      error,
    );
  }
}
