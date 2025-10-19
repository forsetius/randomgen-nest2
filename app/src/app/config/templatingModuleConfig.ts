import path from 'path';
import { TemplatingModuleOptions } from '@templating/types/TemplatingModuleOptions';
import { registerAsTyped } from '@config/registerAsTyped';

const appRoot = path.join(__dirname, '..', '..', '..', '..');

export default () =>
  registerAsTyped(
    'templating',
    () =>
      ({
        paths: path.join(appRoot, 'content', 'cms', 'templates'),
        options: {
          autoescape: false,
          throwOnUndefined: true,
        },
      }) satisfies TemplatingModuleOptions,
  );
