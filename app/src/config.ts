import { EnvVarValidator } from './base/config/EnvVarValidator';
import { ApiVersion } from './base/apidoc/types/ApiVersion';
import { Language } from './shared/types/Language';

export const config = (envVars: EnvVarValidator) => ({
  app: {
    title: 'RandomGen',
    description: 'Random generators for RPGs',
    version: ApiVersion.V1,
    env: envVars.ENV,
    host: envVars.APP_HOST,
    port: envVars.APP_PORT,
    defaultLanguage: Language.EN,
  },
  businessRules: {},
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
