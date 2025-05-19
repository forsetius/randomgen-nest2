import { EnvVarValidator } from '@config/EnvVarValidator';
import { Locale } from '@shared/types/Locale';

export const config = (envVars: EnvVarValidator) => ({
  app: {
    title: 'RandomGen',
    description: 'Random generators for RPGs',
    version: '1.0',
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
  security: {
    rateLimit: {
      limit: 100,
      windowMs: 1000,
    },
  },
});
