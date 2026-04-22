import path from 'node:path';
import { AppConfigModule } from '@forsetius/glitnir-config';
import { MailProvider } from '@forsetius/glitnir-mail';
import type { TestingModule } from '@nestjs/testing';
import { APP_ROOT } from '../../../src/appRoot';
import { appConfigBindings } from '../../../src/app/config/AppConfigBindings';
import { APP_CONFIG_ENV_PREFIX } from '../../../src/app/config/appConfigEnvPrefix';
import {
  type AppConfigRegistry,
  resolveAppConfigRegistry,
} from '../../../src/app/config/AppConfigContracts';
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

function getPrefixedVariableName(
  variableName: ConfigEnvironmentVariableName,
): string {
  return `${APP_CONFIG_ENV_PREFIX}${variableName}`;
}

function buildProcessEnvironment(
  overrides: ConfigEnvironmentOverrides = {},
): NodeJS.ProcessEnv {
  const nextProcessEnvironment = Object.fromEntries(
    Object.entries(initialProcessEnvironment).filter(([variableName]) => {
      return !(
        variableName in baseConfigEnvironment ||
        variableName.replace(APP_CONFIG_ENV_PREFIX, '') in baseConfigEnvironment
      );
    }),
  ) as NodeJS.ProcessEnv;

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

    nextProcessEnvironment[getPrefixedVariableName(variableName)] = value;
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

async function bootstrapConfig(
  overrides: ConfigEnvironmentOverrides = {},
): Promise<{
  readonly testingModule: TestingModule;
  readonly config: AppConfigRegistry;
}> {
  process.env = buildProcessEnvironment(overrides);

  let bootstrappedConfig:
    | {
        readonly testingModule: TestingModule;
        readonly config: AppConfigRegistry;
      }
    | undefined;

  await jest.isolateModulesAsync(async () => {
    const { Test } = loadConfigRuntimeModules();

    const testingModule = await Test.createTestingModule({
      imports: [AppConfigModule.forRoot(appConfigBindings)],
    }).compile();

    const config = resolveAppConfigRegistry((token) =>
      testingModule.get(token),
    );

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

describe('appConfigBindings', () => {
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
        title: 'RandomGen',
        description: 'Random generators for RPGs',
        version: '1.0.0',
        env: Env.TEST,
        host: 'https://example.test/',
        port: 6543,
        defaultLanguage: POLISH_LANGUAGE,
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
        env: Env.TEST,
        langs: {
          supported: [ENGLISH_LANGUAGE, POLISH_LANGUAGE],
          default: POLISH_LANGUAGE,
        },
        strictMode: true,
      });

      expect(config.technobabble).toEqual({
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

  test('maps stage environment to prod for validation package config', async () => {
    const { testingModule, config } = await bootstrapConfig({
      ENV: Env.STAGE,
    });

    try {
      expect(config.app.env).toBe(Env.STAGE);
      expect(config.validation.env).toBe(Env.PROD);
    } finally {
      await testingModule.close();
    }
  });

  test.todo(
    'fails bootstrap when a required base environment value is missing',
  );

  test.todo(
    'fails bootstrap when SMTP credentials are missing for SMTP provider',
  );
});
