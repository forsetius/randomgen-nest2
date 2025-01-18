import { EnvVarValidator } from '@config/EnvVarValidator';
import { ApiVersion } from './base/apidoc/types/ApiVersion';
import { Locale } from '@shared/types/Locale';

export const config = (envVars: EnvVarValidator) => ({
  app: {
    title: 'RandomGen',
    description: 'Random generators for RPGs',
    version: ApiVersion.V1,
    env: envVars.ENV,
    host: envVars.APP_HOST,
    port: envVars.APP_PORT,
    defaultLanguage: Locale.EN,
  },
  business: {
    technobabble: {
      maxResults: 20,
    },
  },
  cms: {
    meta: {
      pl_PL: {
        title: 'RandomGen',
        description: 'Random generators for RPGs',
        keywords: 'random, generator, rpg, dnd, star trek',
      },
      en_US: {
        title: 'Random generator',
        description: 'Random generators for RPGs',
        keywords: 'random, generator, rpg, d&d, star trek',
      },
    },
    menus: {
      pl_PL: {},
      en_US: {},
    },
  },
  docs: {
    endpoint: 'docs',
  },
  security: {
    rateLimit: {
      limit: 100,
      windowMs: 1000,
    },
  },
});
