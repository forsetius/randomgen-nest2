import type { CmsModuleOptions } from '../../cms/types/CmsModuleOptions';

export function resolveCmsModuleConfig(): CmsModuleOptions {
  return {
    contact: {
      recipient: {
        address: 'marcin.pazdziora@forseti.pl',
      },
    },
    legacyRedirects: [],
  };
}
