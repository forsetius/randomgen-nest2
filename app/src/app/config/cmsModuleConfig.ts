import type { CmsModuleOptions } from '../../cms/types/CmsModuleOptions';

export function resolveCmsModuleConfig(): CmsModuleOptions {
  return {
    contact: {
      recipient: {
        address: 'forseti@forseti.pl',
      },
    },
  };
}
