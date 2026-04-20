import path from 'path';
import { APP_ROOT } from '../../appRoot';
import type { AppConfigSource } from './AppConfigSource';

export function resolveTemplatingModuleConfig(
  source: Readonly<AppConfigSource>,
) {
  void source; // FIXME ???

  return {
    paths: path.join(APP_ROOT, 'content', 'cms', 'templates'),
    options: {
      autoescape: false,
      throwOnUndefined: true,
    },
  };
}
