import { EnvVarSchemaType } from '@config/EnvVarSchema';
import { SecurityModuleOptions } from '../../base/security/types/SecurityModuleOptions';
import { registerAsTyped } from '@config/registerAsTyped';

export default (envVars: EnvVarSchemaType) =>
  registerAsTyped(
    'security',
    () =>
      ({
        akismet: {
          key: envVars.AKISMET_KEY,
          siteUrl: envVars.APP_HOST,
        },
        rateLimit: {
          limit: 100,
          windowMs: 1000,
        },
      }) satisfies SecurityModuleOptions,
  );
