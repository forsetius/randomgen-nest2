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
import * as Conf from './config';
import { APP_CONFIG_ENV_PREFIX, APP_ROOT } from '../appConstants';
import type { AppModuleOptions } from './types/AppModuleOptions';
import { CmsModuleConfigContract } from '../cms/CmsModuleConfigContract';
import { TechnobabbleModuleConfigContract } from '../domain/technobabble/TechnobabbleModuleConfigContract';
import { parseConfigData, type ExternalConfigData } from './ExternalConfigData';

type AppConfigRootOptions = Parameters<
  typeof AppConfigModule.forRoot<ExternalConfigData, AppModuleOptions>
>[0];

export const configBindings: AppConfigRootOptions = new AppConfigBuilder<
  ExternalConfigData,
  AppModuleOptions
>(parseConfigData, Conf.resolveAppConfig, {
  dotenvPath: path.join(APP_ROOT, '.env'),
  envPrefix: APP_CONFIG_ENV_PREFIX,
})
  .setup(CmsMdConfigContract, Conf.resolveCmsMdConfig)
  .setup(CmsModuleConfigContract, Conf.resolveCmsModuleConfig)
  .setup(MailConfigContract, Conf.resolveMailModuleConfig)
  .setup(SecurityConfigContract, Conf.resolveSecurityModuleConfig)
  .setup(SpamCheckConfigContract, Conf.resolveSpamCheckModuleConfig)
  .setup(ValidationConfigContract, { strictMode: true })
  .setup(TechnobabbleModuleConfigContract)
  .setup(TemplatingConfigContract, Conf.resolveTemplatingModuleConfig)
  .build();
