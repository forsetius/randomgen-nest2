import type { ValidationConfig } from '@forsetius/glitnir-validation';
import type { AppConfigSource } from './AppConfigSource';

type ValidationModuleConfigOverrides = Pick<ValidationConfig, 'strictMode'>;

export function resolveValidationModuleConfig(
  source: Readonly<AppConfigSource>,
): ValidationModuleConfigOverrides {
  void source; // FIXME ???

  return {
    strictMode: true,
  };
}
