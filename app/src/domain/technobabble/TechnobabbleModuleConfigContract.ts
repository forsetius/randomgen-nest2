import { ConfigContract } from '@forsetius/glitnir-config';
import { z } from 'zod';
import {
  DEFAULT_TECHNOBABBLE_MAX_RESULTS,
  DEFAULT_TECHNOBABBLE_SUPPORTED_LANGS,
} from './TechnobabbleDefaults';

export const TechnobabbleModuleConfigContract = new ConfigContract(
  'technobabble',
  () =>
    z.strictObject({
      maxResults: z
        .number()
        .int()
        .positive()
        .default(DEFAULT_TECHNOBABBLE_MAX_RESULTS),
      supportedLangs: z
        .array(z.enum(DEFAULT_TECHNOBABBLE_SUPPORTED_LANGS))
        .nonempty()
        .default([...DEFAULT_TECHNOBABBLE_SUPPORTED_LANGS]),
    }),
);
