import { ConfigContract } from '@forsetius/glitnir-config';
import { z } from 'zod';
import { DEFAULT_STAR_SYSTEM_SUPPORTED_LANGS } from '../StarSystemDefaults';

const starSystemConfig = z.strictObject({
  contentDir: z.string().nonempty(),
  supportedLangs: z
    .array(z.enum(DEFAULT_STAR_SYSTEM_SUPPORTED_LANGS))
    .nonempty()
    .default([...DEFAULT_STAR_SYSTEM_SUPPORTED_LANGS]),
  additionalPlanetBearingSystemAttempts: z.number().int().min(0).default(3),
});

export const StarSystemModuleConfigContract = new ConfigContract(
  'starsystem',
  () => starSystemConfig,
);

export type StarSystemModuleConfig = z.infer<typeof starSystemConfig>;
