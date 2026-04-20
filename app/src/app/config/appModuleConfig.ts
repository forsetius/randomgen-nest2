import type { Lang } from '@shared/types/Lang';
import { AppModuleOptions } from '@app/types/AppModuleOptions';
import type { AppConfigSource } from './AppConfigSource';

export function resolveAppModuleConfig(
  source: Readonly<AppConfigSource>,
): AppModuleOptions {
  return {
    title: 'RandomGen',
    description: 'Random generators for RPGs',
    version: '1.0.0',
    env: source.ENV,
    host: source.APP_HOST,
    port: source.APP_PORT,
    defaultLanguage: 'pl' satisfies Lang,
  };
}
