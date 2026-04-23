export const Env = {
  PROD: 'prod',
  TEST: 'test',
  DEV: 'dev',
  LOCAL: 'local',
} as const;

export type Env = (typeof Env)[keyof typeof Env];
