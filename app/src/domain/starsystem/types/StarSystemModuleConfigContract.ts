import { ConfigContract } from '@forsetius/glitnir-config';
import { z } from 'zod';
import { DEFAULT_TECHNOBABBLE_SUPPORTED_LANGS } from '../StarSystemDefaults';

const starSystemConfig = z.strictObject({
  contentDir: z.string().nonempty(),
  supportedLangs: z
    .array(z.enum(DEFAULT_TECHNOBABBLE_SUPPORTED_LANGS))
    .nonempty()
    .default([...DEFAULT_TECHNOBABBLE_SUPPORTED_LANGS]),
});

export const StarSystemModuleConfigContract = new ConfigContract(
  'starsystem',
  () => starSystemConfig,
);

export type TechnobabbleModuleConfig = z.infer<typeof starSystemConfig>;
