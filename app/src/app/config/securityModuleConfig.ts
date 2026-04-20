import type { SecurityConfig } from '@forsetius/glitnir-security';
import type { AppConfigSource } from './AppConfigSource';

export function resolveSecurityModuleConfig(
  source: Readonly<AppConfigSource>,
): SecurityConfig {
  void source; // FIXME ???

  return {
    rateLimit: {
      enabled: true,
      limit: 100,
      windowMs: 1000,
    },
  };
}
