import path from 'path';
import { TemplatingModuleOptions } from '@templating/types/TemplatingModuleOptions';
import { registerAsTyped } from '@config/registerAsTyped';
import { APP_ROOT } from '../../appRoot';

export default () =>
  registerAsTyped(
    'templating',
    () =>
      ({
        paths: path.join(APP_ROOT, 'content', 'cms', 'templates'),
        options: {
          autoescape: false,
          throwOnUndefined: true,
        },
      }) satisfies TemplatingModuleOptions,
  );
