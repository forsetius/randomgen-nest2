import { TechnobabbleModuleOptions } from '@domain/technobabble/types/TechnobabbleModuleOptions';
import { registerAsTyped } from '@config/registerAsTyped';
import type { Lang } from '@shared/types/Lang';

export default () =>
  registerAsTyped(
    'technobabble',
    () =>
      ({
        maxResults: 20,
        supportedLangs: ['en', 'pl'] satisfies Lang[],
      }) satisfies TechnobabbleModuleOptions,
  );
