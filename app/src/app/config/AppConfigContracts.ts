import path from 'node:path';
import { ConfigContract } from '@forsetius/glitnir-config';
import type { SecurityConfig } from '@forsetius/glitnir-security';
import { SecurityConfigContract } from '@forsetius/glitnir-security';
import type { SpamCheckConfig } from '@forsetius/glitnir-spamcheck';
import { SpamCheckConfigContract } from '@forsetius/glitnir-spamcheck';
import type { TemplatingConfig } from '@forsetius/glitnir-templating';
import { TemplatingConfigContract } from '@forsetius/glitnir-templating';
import type { ValidationConfig } from '@forsetius/glitnir-validation';
import { ValidationConfigContract } from '@forsetius/glitnir-validation';
import { z } from 'zod';
import type { AppModuleOptions } from '@app/types/AppModuleOptions';
import type { CmsModuleOptions } from '../../base/cms/types/CmsModuleOptions';
import type { TechnobabbleModuleOptions } from '@domain/technobabble/types/TechnobabbleModuleOptions';
import type { MailModuleOptions } from '../../io/mail/types/MailModuleOptions';
import { Env } from '@shared/types/Env';
import { Lang, Langs } from '@shared/types/Lang';
import { MailProvider } from '../../io/mail/types';
import type { AppConfigSource } from './AppConfigSource';

// FIXME Przenieść kontrakty itd. do odpowiednich modułów

// FIXME do pakietu shared
const SEMVER_VERSION_REGEXP =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/u;
// FIXME do shared
const MIN_PORT_NUMBER = 1;
const MAX_PORT_NUMBER = 65535;

const AbsolutePathSchema = z
  .string()
  .trim()
  .min(1)
  .refine((value) => path.isAbsolute(value), {
    message: 'Expected an absolute path',
  });

const AppModuleConfigSchema = z
  .object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    version: z.string().trim().regex(SEMVER_VERSION_REGEXP, {
      message: 'Expected a semantic version string',
    }),
    env: z.enum(Env),
    host: z.string().trim().min(1),
    port: z.number().int().min(MIN_PORT_NUMBER).max(MAX_PORT_NUMBER),
    defaultLanguage: z.enum(Lang),
  })
  .strict();

const CmsModuleConfigSchema = z
  .object({
    appOrigin: z.string().trim().min(1),
    supportedLangs: z.array(z.enum(Lang)).nonempty(),
    fragmentTemplates: z.array(z.string().trim().min(1)).nonempty(),
    paths: z
      .object({
        sourceDir: AbsolutePathSchema,
        outputDir: AbsolutePathSchema,
        mediaDir: AbsolutePathSchema,
        uiDir: AbsolutePathSchema,
      })
      .strict(),
    defaults: z
      .object({
        headerImage: z.string().trim().min(1),
      })
      .strict(),
    brand: z
      .object({
        name: z.string().trim().min(1),
        copyright: z.string().trim().min(1),
        logo: z.string().trim().min(1),
      })
      .strict(),
  })
  .strict();

const MailModuleConfigSchema = z
  .object({
    provider: z.enum(MailProvider),
    credentials: z
      .object({
        smtp: z
          .object({
            host: z.string().trim().min(1),
            port: z.number().int().min(MIN_PORT_NUMBER).max(MAX_PORT_NUMBER),
            user: z.string().trim().min(1),
            pass: z.string().trim().min(1),
          })
          .strict()
          .optional(),
      })
      .strict(),
    sender: z
      .object({
        name: z.string().trim().min(1),
        address: z.string().trim().min(1),
      })
      .strict(),
    adminEmail: z.string().trim().min(1),
  })
  .strict();

const TechnobabbleModuleConfigSchema = z
  .object({
    maxResults: z.number().int().positive(),
    supportedLangs: z.array(z.enum(Lang)).nonempty(),
  })
  .strict();

export interface SharedAppConfig {
  readonly env: ValidationConfig['env'];
  readonly origin: string;
  readonly langs: {
    readonly supported: typeof Langs;
    readonly default: AppModuleOptions['defaultLanguage'];
    readonly charset: 'utf-8'; // FIXME tylko utf???
  };
}

export interface AppConfigRegistry {
  readonly app: AppModuleOptions;
  readonly cms: CmsModuleOptions;
  readonly mail: MailModuleOptions;
  readonly security: SecurityConfig;
  readonly spamcheck: SpamCheckConfig;
  readonly validation: ValidationConfig;
  readonly technobabble: TechnobabbleModuleOptions;
  readonly templating: TemplatingConfig;
}

export function resolveAppConfigRegistry(
  resolve: (token: string | symbol) => unknown,
): AppConfigRegistry {
  return {
    app: resolve(AppModuleConfigContract.token) as AppModuleOptions,
    cms: resolve(CmsModuleConfigContract.token) as CmsModuleOptions,
    mail: resolve(MailModuleConfigContract.token) as MailModuleOptions,
    security: resolve(SecurityConfigContract.token) as SecurityConfig,
    spamcheck: resolve(SpamCheckConfigContract.token) as SpamCheckConfig,
    validation: resolve(ValidationConfigContract.token) as ValidationConfig,
    technobabble: resolve(
      TechnobabbleModuleConfigContract.token,
    ) as TechnobabbleModuleOptions,
    templating: resolve(TemplatingConfigContract.token) as TemplatingConfig,
  };
}

export function normalizeAppOrigin(host: string): string {
  return host === 'localhost' ? 'http://localhost' : host;
}

// FIXME usunąć STAGE i tego potworka
function normalizeSharedEnv(
  env: AppConfigSource['ENV'],
): ValidationConfig['env'] {
  switch (env) {
    case Env.LOCAL:
      return Env.LOCAL;
    case Env.DEV:
      return Env.DEV;
    case Env.TEST:
      return Env.TEST;
    case Env.PROD:
      return Env.PROD;
    case Env.STAGE:
      return Env.PROD;
  }
}

export const resolveSharedAppConfig = (
  source: Readonly<AppConfigSource>,
): SharedAppConfig => ({
  env: normalizeSharedEnv(source.ENV),
  origin: normalizeAppOrigin(source.APP_HOST),
  langs: {
    supported: Langs,
    default: Lang.PL,
    charset: 'utf-8',
  },
});

export const AppModuleConfigContract = new ConfigContract(
  'app',
  () => AppModuleConfigSchema,
);

export const CmsModuleConfigContract = new ConfigContract(
  'cms',
  () => CmsModuleConfigSchema,
);

export const MailModuleConfigContract = new ConfigContract(
  'mail',
  () => MailModuleConfigSchema,
);

export const TechnobabbleModuleConfigContract = new ConfigContract(
  'technobabble',
  () => TechnobabbleModuleConfigSchema,
);
