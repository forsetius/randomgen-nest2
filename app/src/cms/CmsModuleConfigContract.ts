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
    legacyRedirects: z.array(
      z.strictObject({
        sourcePathPrefix: z.string().trim().startsWith('/'),
        targetOrigin: z.url(),
        statusCode: z.union([z.literal(301), z.literal(302)]),
      }),
    ),
  }),
);
