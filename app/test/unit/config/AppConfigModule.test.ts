import path from 'node:path';
import type { TestingModule } from '@nestjs/testing';
import { APP_ROOT } from '../../../src/appRoot';
import { Env } from '../../../src/shared/types/Env';
import type { Lang } from '../../../src/shared/types/Lang';
import { MailProvider } from '../../../src/io/mail/types';

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
type AppConfigModulePackage =
  typeof import('../../../src/base/config/AppConfigModule');
type AppConfigServicePackage =
  typeof import('../../../src/base/config/AppConfigService');
type AppConfigServiceInstance = InstanceType<
  AppConfigServicePackage['AppConfigService']
>;

interface ConfigRuntimeModules {
  readonly Test: TestingModulePackage['Test'];
  readonly AppConfigModule: AppConfigModulePackage['AppConfigModule'];
  readonly AppConfigService: AppConfigServicePackage['AppConfigService'];
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
  CMS_SOURCE_DIR: 'test/e2e/base/cms/_fixtures',
};

function buildProcessEnvironment(
  overrides: ConfigEnvironmentOverrides = {},
): NodeJS.ProcessEnv {
  const nextProcessEnvironment = Object.fromEntries(
    Object.entries(initialProcessEnvironment).filter(([variableName]) => {
      return !(variableName in baseConfigEnvironment);
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

    nextProcessEnvironment[variableName] = value;
  }

  return nextProcessEnvironment;
}

function loadConfigRuntimeModules(): ConfigRuntimeModules {
  const testingModulePackage =
    jest.requireActual<TestingModulePackage>('@nestjs/testing');
  const appConfigModule = jest.requireActual<AppConfigModulePackage>(
    '../../../src/base/config/AppConfigModule',
  );
  const appConfigService = jest.requireActual<AppConfigServicePackage>(
    '../../../src/base/config/AppConfigService',
  );

  return {
    Test: testingModulePackage.Test,
    AppConfigModule: appConfigModule.AppConfigModule,
    AppConfigService: appConfigService.AppConfigService,
  };
}

async function bootstrapConfigService(
  overrides: ConfigEnvironmentOverrides = {},
): Promise<{
  readonly testingModule: TestingModule;
  readonly configService: AppConfigServiceInstance;
}> {
  process.env = buildProcessEnvironment(overrides);

  let bootstrappedConfig:
    | {
        readonly testingModule: TestingModule;
        readonly configService: AppConfigServiceInstance;
      }
    | undefined;

  await jest.isolateModulesAsync(async () => {
    const { Test, AppConfigModule, AppConfigService } =
      loadConfigRuntimeModules();

    const testingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
    }).compile();

    const configService =
      testingModule.get<AppConfigServiceInstance>(AppConfigService);

    bootstrappedConfig = {
      testingModule,
      configService,
    };
  });

  if (typeof bootstrappedConfig === 'undefined') {
    throw new Error('Expected config service bootstrap to return a module');
  }

  return bootstrappedConfig;
}

async function captureConfigBootstrapError(
  overrides: ConfigEnvironmentOverrides = {},
): Promise<Error> {
  try {
    const { testingModule, configService } =
      await bootstrapConfigService(overrides);

    try {
      configService.get('app');
      configService.get('cms');
      configService.get('mail');
      configService.get('security');
      configService.get('technobabble');
      configService.get('templating');
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

describe('AppConfigModule', () => {
  afterEach(() => {
    process.env = { ...initialProcessEnvironment };
    jest.resetModules();
  });

  test('builds application and CMS config from environment values', async () => {
    const { testingModule, configService } = await bootstrapConfigService({
      APP_HOST: 'https://example.test',
      APP_PORT: '6543',
      CMS_SOURCE_DIR: 'test/e2e/base/cms/_fixtures/',
    });

    try {
      expect(configService.get('app')).toEqual({
        title: 'RandomGen',
        description: 'Random generators for RPGs',
        version: '1.0',
        env: Env.TEST,
        host: 'https://example.test/',
        port: 6543,
        defaultLanguage: POLISH_LANGUAGE,
      });

      expect(configService.get('cms')).toEqual({
        appOrigin: 'https://example.test/',
        supportedLangs: [ENGLISH_LANGUAGE, POLISH_LANGUAGE],
        fragmentTemplates: ['fragment-img-card', 'fragment-list-item'],
        paths: {
          sourceDir: path.join(
            APP_ROOT,
            'test/e2e/base/cms/_fixtures',
            'sources',
          ),
          outputDir: path.join(
            APP_ROOT,
            'test/e2e/base/cms/_fixtures',
            'static',
            'pages',
          ),
          mediaDir: path.join(
            APP_ROOT,
            'test/e2e/base/cms/_fixtures',
            'static',
            'media',
          ),
          uiDir: path.join(
            APP_ROOT,
            'test/e2e/base/cms/_fixtures',
            'static',
            'ui',
          ),
        },
        defaults: {
          headerImage: 'index-head.jpg',
        },
        brand: {
          name: 'Forseti: Abstract Works',
          copyright: '© 2025 by Marcin "Forseti" Paździora',
          logo: 'logo-w.png',
        },
      });
    } finally {
      await testingModule.close();
    }
  });

  test('builds dummy mail config without SMTP credentials', async () => {
    const { testingModule, configService } = await bootstrapConfigService({
      MAIL_PROVIDER: MailProvider.DUMMY,
      MAIL_SENDER_NAME: 'Local Dummy Sender',
      MAIL_SENDER_EMAIL: 'local-dummy@example.com',
    });

    try {
      expect(configService.get('mail')).toEqual({
        provider: MailProvider.DUMMY,
        credentials: {},
        sender: {
          name: 'Local Dummy Sender',
          address: 'local-dummy@example.com',
        },
        adminEmail: 'forseti@forseti.pl',
      });
    } finally {
      await testingModule.close();
    }
  });

  test('builds SMTP mail config with credentials from environment values', async () => {
    const { testingModule, configService } = await bootstrapConfigService({
      MAIL_PROVIDER: MailProvider.SMTP,
      MAIL_SENDER_NAME: 'SMTP Sender',
      MAIL_SENDER_EMAIL: 'smtp@example.com',
      SMTP_HOST: 'mail.example.com',
      SMTP_PORT: '2525',
      SMTP_USER: 'smtp-login',
      SMTP_PASSWORD: 'smtp-secret',
    });

    try {
      expect(configService.get('mail')).toEqual({
        provider: MailProvider.SMTP,
        credentials: {
          smtp: {
            host: 'mail.example.com',
            port: 2525,
            user: 'smtp-login',
            pass: 'smtp-secret',
          },
        },
        sender: {
          name: 'SMTP Sender',
          address: 'smtp@example.com',
        },
        adminEmail: 'forseti@forseti.pl',
      });
    } finally {
      await testingModule.close();
    }
  });

  test('builds security, technobabble, and templating config from inputs and defaults', async () => {
    const { testingModule, configService } = await bootstrapConfigService({
      AKISMET_KEY: 'akismet-test-key',
      APP_HOST: 'https://example.test',
    });

    try {
      expect(configService.get('security')).toEqual({
        akismet: {
          key: 'akismet-test-key',
          siteUrl: 'https://example.test/',
        },
        rateLimit: {
          limit: 100,
          windowMs: 1000,
        },
      });

      expect(configService.get('technobabble')).toEqual({
        maxResults: 20,
        supportedLangs: [ENGLISH_LANGUAGE, POLISH_LANGUAGE],
      });

      expect(configService.get('templating')).toEqual({
        paths: path.join(APP_ROOT, 'content', 'cms', 'templates'),
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
