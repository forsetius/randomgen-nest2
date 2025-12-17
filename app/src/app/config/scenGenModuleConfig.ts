import { registerAsTyped } from '@config/registerAsTyped';
import { Lang } from '@shared/types/Lang';
import { ScenGenModuleOptions } from '@domain/scengen/validation/ScenGenConfigSchema';
import path from 'path';
import { EnvVarSchemaType } from '@config/EnvVarSchema';

export default (envVars: EnvVarSchemaType) =>
  registerAsTyped(
    'scengen',
    () =>
      ({
        supportedLangs: [Lang.EN, Lang.PL],
        sourceDir: path.join(envVars.SCENGEN_SOURCE_DIR, 'sources'),
      }) satisfies ScenGenModuleOptions,
  );
