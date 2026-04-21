import path from 'path';
import type { TemplatingConfig } from '@forsetius/glitnir-templating';
import { APP_ROOT } from '../../appRoot';
import type { AppConfigSource } from './AppConfigSource';

export function resolveTemplatingModuleConfig(
  source: Readonly<AppConfigSource>,
): TemplatingConfig {
  void source; // FIXME ???

  return {
    paths: [path.join(APP_ROOT, 'content', 'cms', 'templates')],
    options: {
      autoescape: false,
      throwOnUndefined: true,
    },
  };
}
