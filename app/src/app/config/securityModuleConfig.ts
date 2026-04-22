import type { AppConfigSource } from './AppConfigSource';

interface SecurityConfigOverrides {
  readonly rateLimit: {
    readonly enabled: true;
    readonly global: {
      readonly limit: number;
      readonly windowMs: number;
      readonly blockDurationMs: number;
      readonly setHeaders: boolean;
    };
  };
}

export function resolveSecurityModuleConfig(
  source: Readonly<AppConfigSource>,
): SecurityConfigOverrides {
  void source; // FIXME ???

  return {
    rateLimit: {
      enabled: true,
      global: {
        limit: 100,
        windowMs: 1000,
        blockDurationMs: 0,
        setHeaders: true,
      },
    },
  };
}
