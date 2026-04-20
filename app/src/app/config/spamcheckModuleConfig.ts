import type { SpamCheckConfig } from '@forsetius/glitnir-spamcheck';
import type { AppConfigSource } from './AppConfigSource';

type SpamCheckModuleConfigOverrides = Pick<SpamCheckConfig, 'akismetKey'>;

export function resolveSpamCheckModuleConfig(
  source: Readonly<AppConfigSource>,
): SpamCheckModuleConfigOverrides {
  return {
    akismetKey: source.AKISMET_KEY,
  };
}
