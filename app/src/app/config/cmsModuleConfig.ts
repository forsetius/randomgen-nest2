import type { CmsModuleOptions } from '../../cms/types/CmsModuleOptions';
import type { AppConfigSource } from './AppConfigSource';

export function resolveCmsModuleConfig(
  source: Readonly<AppConfigSource>,
): CmsModuleOptions {
  void source;

  return {
    contact: {
      recipient: {
        address: 'forseti@forseti.pl',
      },
    },
  };
}
