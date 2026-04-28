import path from 'node:path';
import {
  AppConfigModule,
  SHARED_CONFIG_TOKEN,
} from '@forsetius/glitnir-config';
import {
  CmsMdConfigContract,
  type CmsMdConfig,
} from '@forsetius/glitnir-cms-md';
import {
  MailConfigContract,
  MailProvider,
  type MailConfig,
} from '@forsetius/glitnir-mail';
import {
  SecurityConfigContract,
  type SecurityConfig,
} from '@forsetius/glitnir-security';
import {
  SpamCheckConfigContract,
  type SpamCheckConfig,
} from '@forsetius/glitnir-spamcheck';
import {
  TemplatingConfigContract,
  type TemplatingConfig,
} from '@forsetius/glitnir-templating';
import {
  ValidationConfigContract,
  type ValidationConfig,
} from '@forsetius/glitnir-validation';
import type { TestingModule } from '@nestjs/testing';
import { APP_CONFIG_ENV_PREFIX, APP_ROOT } from '../../../src/appConstants';
import { configBindings } from '../../../src/app/ConfigBindings';
import type { AppModuleOptions } from '../../../src/app/types/AppModuleOptions';
import { CmsModuleConfigContract } from '../../../src/cms/CmsModuleConfigContract';
import type { CmsModuleOptions } from '../../../src/cms/types/CmsModuleOptions';
import {
  TechnobabbleModuleConfig,
  TechnobabbleModuleConfigContract,
} from '../../../src/domain/technobabble/types/TechnobabbleModuleConfigContract';
import { Env } from '../../../src/shared/types/Env';
import type { Lang } from '../../../src/shared/types/Lang';

const ENGLISH_LANGUAGE: Lang = 'en';
const POLISH_LANGUAGE: Lang = 'pl';

type ConfigEnvironmentVariableName =
  | 'ENV'
  | 'AKISMET_KEY'
  | 'APP_HOST'
  | 'APP_PORT'
  | 'MAIL_PROVIDER'
  | 'MAIL_SENDER_NAME'
  | 'MAIL_SENDER_EMAIL'
  | 'SMTP_HOST'
  | 'SMTP_PORT'
  | 'SMTP_USER'
  | 'SMTP_PASSWORD'
  | 'CMS_SOURCE_DIR';

type ConfigEnvironmentOverrides = Partial<
  Record<ConfigEnvironmentVariableName, string | undefined>
>;

type TestingModulePackage = typeof import('@nestjs/testing');

interface ConfigRuntimeModules {
  readonly Test: TestingModulePackage['Test'];
}

const initialProcessEnvironment = { ...process.env };

const baseConfigEnvironment: Record<ConfigEnvironmentVariableName, string> = {
  ENV: Env.TEST,
  AKISMET_KEY: 'dummy_key',
  APP_HOST: 'localhost',
  APP_PORT: '4321',
  MAIL_PROVIDER: MailProvider.DUMMY,
  MAIL_SENDER_NAME: 'Dummy Sender',
  MAIL_SENDER_EMAIL: 'dummy@example.com',
  SMTP_HOST: 'smtp.example.com',
  SMTP_PORT: '587',
  SMTP_USER: 'smtp-user',
  SMTP_PASSWORD: 'smtp-password',
  CMS_SOURCE_DIR: 'test/e2e/cms/_fixtures',
};

function getEnvironmentVariableName(
  variableName: ConfigEnvironmentVariableName,
): string {
  return `${APP_CONFIG_ENV_PREFIX}${variableName}`;
}

function buildProcessEnvironment(
  overrides: ConfigEnvironmentOverrides = {},
): NodeJS.ProcessEnv {
  const nextProcessEnvironment: NodeJS.ProcessEnv = Object.fromEntries(
    Object.entries(initialProcessEnvironment).filter(([variableName]) => {
      return !(variableName in baseConfigEnvironment);
    }),
  );

  for (const variableName of Object.keys(
    baseConfigEnvironment,
  ) as ConfigEnvironmentVariableName[]) {
    const hasOverride = Object.prototype.hasOwnProperty.call(
      overrides,
      variableName,
    );
    const value = hasOverride
      ? overrides[variableName]
      : baseConfigEnvironment[variableName];

    if (typeof value === 'undefined') {
      continue;
    }

    nextProcessEnvironment[getEnvironmentVariableName(variableName)] = value;
  }

  return nextProcessEnvironment;
}

function loadConfigRuntimeModules(): ConfigRuntimeModules {
  const testingModulePackage =
    jest.requireActual<TestingModulePackage>('@nestjs/testing');

  return {
    Test: testingModulePackage.Test,
  };
}

function resolveConfigRegistry(testingModule: TestingModule) {
  return {
    app: testingModule.get<AppModuleOptions>(SHARED_CONFIG_TOKEN),
    cmsMd: testingModule.get<CmsMdConfig>(CmsMdConfigContract.token),
    cms: testingModule.get<CmsModuleOptions>(CmsModuleConfigContract.token),
    mail: testingModule.get<MailConfig>(MailConfigContract.token),
    security: testingModule.get<SecurityConfig>(SecurityConfigContract.token),
    spamcheck: testingModule.get<SpamCheckConfig>(
      SpamCheckConfigContract.token,
    ),
    validation: testingModule.get<ValidationConfig>(
      ValidationConfigContract.token,
    ),
    technobabble: testingModule.get<TechnobabbleModuleConfig>(
      TechnobabbleModuleConfigContract.token,
    ),
    templating: testingModule.get<TemplatingConfig>(
      TemplatingConfigContract.token,
    ),
  };
}

async function bootstrapConfig(
  overrides: ConfigEnvironmentOverrides = {},
): Promise<{
  readonly testingModule: TestingModule;
  readonly config: ReturnType<typeof resolveConfigRegistry>;
}> {
  process.env = buildProcessEnvironment(overrides);

  let bootstrappedConfig:
    | {
        readonly testingModule: TestingModule;
        readonly config: ReturnType<typeof resolveConfigRegistry>;
      }
    | undefined;

  await jest.isolateModulesAsync(async () => {
    const { Test } = loadConfigRuntimeModules();

    const testingModule = await Test.createTestingModule({
      imports: [AppConfigModule.forRoot(configBindings)],
    }).compile();

    const config = resolveConfigRegistry(testingModule);

    bootstrappedConfig = {
      testingModule,
      config,
    };
  });

  if (typeof bootstrappedConfig === 'undefined') {
    throw new Error('Expected config bootstrap to return a module');
  }

  return bootstrappedConfig;
}

async function captureConfigBootstrapError(
  overrides: ConfigEnvironmentOverrides = {},
): Promise<Error> {
  try {
    const { testingModule, config } = await bootstrapConfig(overrides);

    try {
      expect(config.app).toBeDefined();
      expect(config.cmsMd).toBeDefined();
      expect(config.cms).toBeDefined();
      expect(config.mail).toBeDefined();
      expect(config.security).toBeDefined();
      expect(config.spamcheck).toBeDefined();
      expect(config.validation).toBeDefined();
      expect(config.technobabble).toBeDefined();
      expect(config.templating).toBeDefined();
    } finally {
      await testingModule.close();
    }
  } catch (caughtError: unknown) {
    expect(caughtError).toBeInstanceOf(Error);

    if (!(caughtError instanceof Error)) {
      throw new Error('Expected config bootstrap to throw an Error instance', {
        cause: caughtError,
      });
    }

    return caughtError;
  }

  throw new Error('Expected config bootstrap to fail');
}

describe('configBindings', () => {
  afterEach(() => {
    process.env = { ...initialProcessEnvironment };
    jest.resetModules();
  });

  test('builds application and CMS config from environment values', async () => {
    const { testingModule, config } = await bootstrapConfig({
      APP_HOST: 'https://example.test',
      APP_PORT: '6543',
      CMS_SOURCE_DIR: 'test/e2e/cms/_fixtures/',
    });

    try {
      expect(config.app).toEqual({
        env: Env.TEST,
        host: 'https://example.test/',
        origin: 'https://example.test/',
        port: 6543,
        langs: {
          supported: [ENGLISH_LANGUAGE, POLISH_LANGUAGE],
          default: POLISH_LANGUAGE,
          charset: 'utf-8',
        },
      });

      expect(config.cmsMd).toEqual({
        appOrigin: 'https://example.test/',
        langs: {
          supported: [ENGLISH_LANGUAGE, POLISH_LANGUAGE],
          default: POLISH_LANGUAGE,
        },
        paths: {
          sourceDir: path.join(APP_ROOT, 'test/e2e/cms/_fixtures', 'sources'),
          outputDir: path.join(
            APP_ROOT,
            'test/e2e/cms/_fixtures',
            'static',
            'pages',
          ),
          mediaDir: path.join(
            APP_ROOT,
            'test/e2e/cms/_fixtures',
            'static',
            'media',
          ),
          uiDir: path.join(APP_ROOT, 'test/e2e/cms/_fixtures', 'static', 'ui'),
        },
        defaults: {
          headerImage: 'index-head.jpg',
        },
        brand: {
          name: 'Forseti: Abstract Works',
          copyright: '© 2025 by Marcin "Forseti" Paździora',
          logo: 'logo-w.png',
        },
        templates: {
          rssFeed: 'rss-feed',
          fragmentCard: 'fragment-img-card',
          fragmentListItem: 'fragment-list-item',
          pageDefault: 'page-default',
          blockPlain: 'block-plain',
          lightboxGallery: 'lightbox-gallery',
          lightboxImage: 'lightbox-image',
          partialGallerySet: 'partial-gallery-set',
        },
      });

      expect(config.cms).toEqual({
        contact: {
          recipient: {
            address: 'forseti@forseti.pl',
          },
        },
      });
    } finally {
      await testingModule.close();
    }
  });

  test('builds dummy mail config without SMTP credentials', async () => {
    const { testingModule, config } = await bootstrapConfig({
      MAIL_PROVIDER: MailProvider.DUMMY,
      MAIL_SENDER_NAME: 'Local Dummy Sender',
      MAIL_SENDER_EMAIL: 'local-dummy@example.com',
    });

    try {
      expect(config.mail).toEqual({
        provider: MailProvider.DUMMY,
        credentials: {},
        smtp: {
          verifyOnStartup: true,
          connectionTimeoutMs: 120000,
          greetingTimeoutMs: 30000,
        },
        dummy: {
          logCalls: false,
        },
        sender: {
          name: 'Local Dummy Sender',
          address: 'local-dummy@example.com',
        },
      });
    } finally {
      await testingModule.close();
    }
  });

  test('builds SMTP mail config with credentials from environment values', async () => {
    const { testingModule, config } = await bootstrapConfig({
      MAIL_PROVIDER: MailProvider.SMTP,
      MAIL_SENDER_NAME: 'SMTP Sender',
      MAIL_SENDER_EMAIL: 'smtp@example.com',
      SMTP_HOST: 'mail.example.com',
      SMTP_PORT: '2525',
      SMTP_USER: 'smtp-login',
      SMTP_PASSWORD: 'smtp-secret',
    });

    try {
      expect(config.mail).toEqual({
        provider: MailProvider.SMTP,
        credentials: {
          smtp: {
            host: 'mail.example.com',
            port: 2525,
            user: 'smtp-login',
            pass: 'smtp-secret',
          },
        },
        smtp: {
          verifyOnStartup: true,
          connectionTimeoutMs: 120000,
          greetingTimeoutMs: 30000,
        },
        dummy: {
          logCalls: false,
        },
        sender: {
          name: 'SMTP Sender',
          address: 'smtp@example.com',
        },
      });
    } finally {
      await testingModule.close();
    }
  });

  test('allows SMTP port 0 while keeping transport config typed', async () => {
    const { testingModule, config } = await bootstrapConfig({
      MAIL_PROVIDER: MailProvider.SMTP,
      SMTP_PORT: '0',
    });

    try {
      expect(config.mail.credentials.smtp?.port).toBe(0);
    } finally {
      await testingModule.close();
    }
  });

  test('builds security, spamcheck, technobabble, and templating config from inputs and defaults', async () => {
    const { testingModule, config } = await bootstrapConfig({
      AKISMET_KEY: 'akismet-test-key',
      APP_HOST: 'https://example.test',
    });

    try {
      expect(config.security).toEqual({
        proxy: {
          trustProxy: false,
        },
        cors: {
          enabled: false,
        },
        csp: {
          enabled: true,
          reportOnly: false,
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
            fontSrc: ["'self'", 'https:', 'data:'],
            imgSrc: ["'self'", 'data:'],
            connectSrc: ["'self'"],
            frameSrc: ["'self'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            frameAncestors: ["'self'"],
            formAction: ["'self'"],
            scriptSrcAttr: ["'none'"],
          },
        },
        rateLimit: {
          enabled: true,
          global: {
            limit: 100,
            windowMs: 1000,
            blockDurationMs: 0,
            setHeaders: true,
          },
        },
        addons: {
          csrf: {
            enabled: false,
          },
          slowDown: {
            enabled: false,
          },
        },
      });

      expect(config.spamcheck).toEqual({
        akismetKey: 'akismet-test-key',
        siteUrl: 'https://example.test/',
        langs: {
          supported: [ENGLISH_LANGUAGE, POLISH_LANGUAGE],
          charset: 'utf-8',
        },
      });

      expect(config.validation).toEqual({
        isProduction: false,
        langs: {
          supported: [ENGLISH_LANGUAGE, POLISH_LANGUAGE],
          default: POLISH_LANGUAGE,
        },
      });

      expect(config.technobabble).toEqual({
        contentDir: 'content/technobabble',
        maxResults: 20,
        supportedLangs: [ENGLISH_LANGUAGE, POLISH_LANGUAGE],
      });

      expect(config.templating).toEqual({
        paths: [path.join(APP_ROOT, 'content', 'cms', 'templates')],
        options: {
          autoescape: false,
          throwOnUndefined: true,
        },
      });
    } finally {
      await testingModule.close();
    }
  });

  test('fails bootstrap when APP_PORT is outside the supported range', async () => {
    const caughtError = await captureConfigBootstrapError({
      APP_PORT: '70000',
    });

    expect(caughtError.message).toContain('APP_PORT');
  });

  test.todo(
    'fails bootstrap when a required base environment value is missing',
  );

  test.todo(
    'fails bootstrap when SMTP credentials are missing for SMTP provider',
  );
});
