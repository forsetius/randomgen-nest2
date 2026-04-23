import { ConfigContract } from '@forsetius/glitnir-config';
import { z } from 'zod';

export const CmsModuleConfigContract = new ConfigContract('cms', () =>
  z.strictObject({
    contact: z.strictObject({
      recipient: z.strictObject({
        address: z.email(),
        name: z.string().trim().min(1).optional(),
      }),
    }),
  }),
);
