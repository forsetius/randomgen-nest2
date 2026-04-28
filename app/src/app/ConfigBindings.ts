import path from 'node:path';
import {
  AppConfigBuilder,
  type AppConfigModule,
} from '@forsetius/glitnir-config';
import { CmsMdConfigContract } from '@forsetius/glitnir-cms-md';
import { MailConfigContract } from '@forsetius/glitnir-mail';
import { SecurityConfigContract } from '@forsetius/glitnir-security';
import { SpamCheckConfigContract } from '@forsetius/glitnir-spamcheck';
import { TemplatingConfigContract } from '@forsetius/glitnir-templating';
import { ValidationConfigContract } from '@forsetius/glitnir-validation';
import * as Config from './config';
import { APP_CONFIG_ENV_PREFIX, APP_ROOT } from '../appConstants';
import type { AppModuleOptions } from './types/AppModuleOptions';
import { CmsModuleConfigContract } from '../cms/CmsModuleConfigContract';
import { TechnobabbleModuleConfigContract } from '../domain/technobabble/types/TechnobabbleModuleConfigContract';
import { parseConfigData, type ExternalConfigData } from './ExternalConfigData';
import { Env } from '../shared/types/Env';

type AppConfigRootOptions = Parameters<
  typeof AppConfigModule.forRoot<ExternalConfigData, AppModuleOptions>
>[0];

const configBootstrapOptions = {
  dotenvPath: {
    [Env.DEV]: path.join(APP_ROOT, '.env'),
    [Env.TEST]: path.join(APP_ROOT, '.env.test'),
  },
  envPrefix: APP_CONFIG_ENV_PREFIX,
};

export const configBindings: AppConfigRootOptions = new AppConfigBuilder<
  ExternalConfigData,
  AppModuleOptions
>(parseConfigData, Config.resolveAppConfig, configBootstrapOptions)
  .setup(CmsMdConfigContract, Config.resolveCmsMdConfig)
  .setup(CmsModuleConfigContract, Config.resolveCmsModuleConfig)
  .setup(MailConfigContract, Config.resolveMailModuleConfig)
  .setup(SecurityConfigContract, Config.resolveSecurityModuleConfig)
  .setup(SpamCheckConfigContract, Config.resolveSpamCheckModuleConfig)
  .setup(ValidationConfigContract, Config.resolveValidationModuleConfig)
  .setup(TemplatingConfigContract, Config.resolveTemplatingModuleConfig)
  .setup(TechnobabbleModuleConfigContract, {
    contentDir: 'content/technobabble',
  })
  .build();
