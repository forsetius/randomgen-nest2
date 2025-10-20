import { TechnobabbleModuleOptions } from '@domain/technobabble/types/TechnobabbleModuleOptions';
import { registerAsTyped } from '@config/registerAsTyped';
import { Lang } from '@shared/types/Lang';

export default () =>
  registerAsTyped(
    'technobabble',
    () =>
      ({
        maxResults: 20,
        supportedLangs: [Lang.EN, Lang.PL],
      }) satisfies TechnobabbleModuleOptions,
  );
