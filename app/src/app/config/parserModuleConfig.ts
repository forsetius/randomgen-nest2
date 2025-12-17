import { registerAsTyped } from '@config/registerAsTyped';
import { ParserModuleOptions } from '../../base/parser/types/ParserModuleOptions';

export default () =>
  registerAsTyped(
    'parser',
    () =>
      ({
        concurrency: 8,
      }) satisfies ParserModuleOptions,
  );
