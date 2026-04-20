import { TechnobabbleModuleOptions } from '@domain/technobabble/types/TechnobabbleModuleOptions';
import {
  DEFAULT_TECHNOBABBLE_MAX_RESULTS,
  DEFAULT_TECHNOBABBLE_SUPPORTED_LANGS,
} from '@domain/technobabble/TechnobabbleDefaults';
import type { AppConfigSource } from './AppConfigSource';

// FIXME przenieść do technobabble, może usunąć stałe?

export function resolveTechnobabbleModuleConfig(
  source: Readonly<AppConfigSource>,
): TechnobabbleModuleOptions {
  void source;

  return {
    maxResults: DEFAULT_TECHNOBABBLE_MAX_RESULTS,
    supportedLangs: [...DEFAULT_TECHNOBABBLE_SUPPORTED_LANGS],
  };
}
