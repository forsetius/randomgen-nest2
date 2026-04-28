import type { ValidationConfig } from '@forsetius/glitnir-validation';
import type { ExternalConfigData } from '../ExternalConfigData';
import { Env } from '../../shared/types/Env';

type ValidationModuleConfigOverrides = Pick<ValidationConfig, 'isProduction'>;

export function resolveValidationModuleConfig(
  configData: Readonly<ExternalConfigData>,
): ValidationModuleConfigOverrides {
  return {
    isProduction: configData.ENV === Env.PROD,
  };
}
