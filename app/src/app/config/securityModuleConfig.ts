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

export function resolveSecurityModuleConfig(): SecurityConfigOverrides {
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
