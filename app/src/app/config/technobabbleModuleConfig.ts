import { TechnobabbleModuleOptions } from '@domain/technobabble/types/TechnobabbleModuleOptions';
import { registerAsTyped } from '@config/registerAsTyped';

export default () =>
  registerAsTyped(
    'technobabble',
    () =>
      ({
        maxResults: 20,
      }) satisfies TechnobabbleModuleOptions,
  );
