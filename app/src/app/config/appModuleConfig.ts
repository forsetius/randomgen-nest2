import { EnvVarSchemaType } from '@config/EnvVarSchema';
import { Lang } from '@shared/types/Lang';
import { AppModuleOptions } from '@app/types/AppModuleOptions';
import { registerAsTyped } from '@config/registerAsTyped';

export default (envVars: EnvVarSchemaType) =>
  registerAsTyped(
    'app',
    () =>
      ({
        title: 'RandomGen',
        description: 'Random generators for RPGs',
        version: '1.0',
        env: envVars.ENV,
        host: envVars.APP_HOST,
        port: envVars.APP_PORT,
        defaultLanguage: Lang.PL,
      }) satisfies AppModuleOptions,
  );
