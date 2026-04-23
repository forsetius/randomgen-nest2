import type { SpamCheckConfig } from '@forsetius/glitnir-spamcheck';
import type { ExternalConfigData } from '../ExternalConfigData';

type SpamCheckModuleConfigOverrides = Pick<SpamCheckConfig, 'akismetKey'>;

export function resolveSpamCheckModuleConfig(
  configData: Readonly<ExternalConfigData>,
): SpamCheckModuleConfigOverrides {
  return {
    akismetKey: configData.AKISMET_KEY,
  };
}
