import path from 'node:path';
import { AppConfigBuilder } from '@forsetius/glitnir-config';
import { SecurityConfigContract } from '@forsetius/glitnir-security';
import { SpamCheckConfigContract } from '@forsetius/glitnir-spamcheck';
import { ValidationConfigContract } from '@forsetius/glitnir-validation';
import { APP_ROOT } from '../../appRoot';
import {
  AppModuleConfigContract,
  CmsModuleConfigContract,
  MailModuleConfigContract,
  resolveSharedAppConfig,
  TemplatingModuleConfigContract,
  TechnobabbleModuleConfigContract,
  type SharedAppConfig,
} from './AppConfigContracts';
import {
  resolveAppConfigSource,
  type AppConfigSource,
} from './AppConfigSource';
import { resolveAppModuleConfig } from './appModuleConfig';
import { resolveCmsModuleConfig } from './cmsModuleConfig';
import { resolveMailModuleConfig } from './mailModuleConfig';
import { resolveSecurityModuleConfig } from './securityModuleConfig';
import { resolveSpamCheckModuleConfig } from './spamcheckModuleConfig';
import { resolveTechnobabbleModuleConfig } from './technobabbleModuleConfig';
import { resolveTemplatingModuleConfig } from './templatingModuleConfig';
import { resolveValidationModuleConfig } from './validationModuleConfig';
import { APP_CONFIG_ENV_PREFIX } from './appConfigEnvPrefix';

export const appConfigBindings = new AppConfigBuilder<
  AppConfigSource,
  SharedAppConfig
>(resolveAppConfigSource, resolveSharedAppConfig, {
  dotenvPath: path.join(APP_ROOT, '.env'),
  envPrefix: APP_CONFIG_ENV_PREFIX,
  isGlobal: true, // FIXME usunąć bo default
})
  .setup(AppModuleConfigContract, resolveAppModuleConfig)
  .setup(CmsModuleConfigContract, resolveCmsModuleConfig)
  .setup(MailModuleConfigContract, resolveMailModuleConfig)
  .setup(SecurityConfigContract, resolveSecurityModuleConfig)
  .setup(SpamCheckConfigContract, resolveSpamCheckModuleConfig)
  .setup(ValidationConfigContract, resolveValidationModuleConfig)
  .setup(TechnobabbleModuleConfigContract, resolveTechnobabbleModuleConfig)
  .setup(TemplatingModuleConfigContract, resolveTemplatingModuleConfig)
  .build();
