import { Lang, Langs } from '../../shared/types/Lang';
import { AppModuleOptions } from '../types/AppModuleOptions';
import { normalizeAppOrigin } from '../../shared/util/url';
import type { ExternalConfigData } from '../ExternalConfigData';

export function resolveAppConfig(
  configData: Readonly<ExternalConfigData>,
): AppModuleOptions {
  return {
    env: configData.ENV,
    host: configData.APP_HOST,
    origin: normalizeAppOrigin(configData.APP_HOST),
    port: configData.APP_PORT,
    langs: {
      supported: [...Langs],
      default: Lang.PL,
      charset: 'utf-8',
    },
  };
}
