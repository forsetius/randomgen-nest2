import { z } from 'zod';
import { BlockZodSchema } from './BlockZodSchema';

export const PageZodSchema = z
  .object({
    title: z.string(),
    subtitle: z.string().optional(),
    headerImage: z.string(),
    thumbnailImage: z.string().optional(),
    excerpt: z.string().optional(),
    lead: z.string().optional(),
    content: z.string(),
    tags: z.array(z.string()).optional(),
    template: z.string(),
    slots: z.record(z.string(), z.array(BlockZodSchema)).optional(),
    blocks: z.record(z.string(), BlockZodSchema).optional(),
  })
  .strict();

export type PageDef = z.infer<typeof PageZodSchema>;
