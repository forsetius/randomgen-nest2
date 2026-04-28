export const Env = {
  PROD: 'prod',
  STAGE: 'stage',
  TEST: 'test',
  DEV: 'dev',
} as const;

export type Env = (typeof Env)[keyof typeof Env];
