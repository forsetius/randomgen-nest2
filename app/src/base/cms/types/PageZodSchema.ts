import { z } from 'zod';
import { BlockZodSchema } from './BlockZodSchema';

export const PageZodSchema = z
  .object({
    title: z.string(),
    subtitle: z.string().optional(),
    headerImage: z.string().default('index-head.jpg'),
    thumbnailImage: z.string().optional(),
    excerpt: z.string().optional(),
    lead: z.string().optional(),
    content: z.string(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    subcategoryName: z.string().optional(),
    sort: z.number().optional(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}(?: \d{2}:\d{2}(?::\d{2})?)?$/)
      .optional(),
    template: z.string().default('page-default'),
    slots: z.record(z.string(), z.array(BlockZodSchema)).optional(),
    blocks: z.record(z.string(), BlockZodSchema).optional(),
    searchable: z.boolean().default(true),
    meta: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        robots: z
          .object({
            index: z.boolean().default(true),
            follow: z.boolean().default(true),
          })
          .optional(),
      })
      .optional(),
  })
  .strict()
  .transform((data) => ({
    ...data,
    excerpt: data.excerpt ?? data.lead,
    thumbnailImage: data.thumbnailImage ?? data.headerImage,
    meta: {
      title: data.meta?.title ?? data.title,
      description: data.meta?.description ?? data.excerpt ?? data.lead ?? '',
      robots: data.meta?.robots ?? { index: true, follow: true },
    },
  }));

export type PageDef = z.infer<typeof PageZodSchema>;
