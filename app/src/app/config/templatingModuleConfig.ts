import path from 'node:path';
import type { TemplatingConfig } from '@forsetius/glitnir-templating';
import { APP_ROOT } from '../../appConstants';

export function resolveTemplatingModuleConfig(): TemplatingConfig {
  return {
    paths: [path.join(APP_ROOT, 'content', 'cms', 'templates')],
    options: {
      autoescape: false,
      throwOnUndefined: true,
    },
  };
}
