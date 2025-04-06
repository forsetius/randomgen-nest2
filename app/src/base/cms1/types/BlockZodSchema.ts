import { z } from 'zod';
import { BlockType } from './BlockType';

const CommonBlockZodSchema = z.object({
  name: z.string(),
  template: z.string(),
  class: z.string().optional(),
});

export const ApiCallBlockZodSchema = CommonBlockZodSchema.extend({
  type: z.literal(BlockType.API_CALL),
  url: z.string().url(),
});

export const PageBlockZodSchema = CommonBlockZodSchema.extend({
  type: z.literal(BlockType.PAGE),
  slug: z.string(),
});

export const PageListBlockZodSchema = CommonBlockZodSchema.extend({
  type: z.literal(BlockType.PAGE_LIST),
  count: z.number().min(1),
  skip: z.number().min(1).optional(),
});

export const PageSetBlockZodSchema = CommonBlockZodSchema.extend({
  type: z.literal(BlockType.PAGE_SET),
  items: z.array(z.string()),
});

export const StaticBlockZodSchema = CommonBlockZodSchema.extend({
  type: z.literal(BlockType.STATIC),
  content: z.string(),
});

export const TagBlockZodSchema = CommonBlockZodSchema.extend({
  type: z.literal(BlockType.TAG),
  tag: z.string(),
});

export const BlockZodSchema = z.discriminatedUnion('type', [
  ApiCallBlockZodSchema,
  PageBlockZodSchema,
  PageListBlockZodSchema,
  PageSetBlockZodSchema,
  StaticBlockZodSchema,
  TagBlockZodSchema,
]);

export type BlockDef = z.infer<typeof BlockZodSchema>;
export type ApiCallBlockDef = z.infer<typeof ApiCallBlockZodSchema>;
export type PageBlockDef = z.infer<typeof PageBlockZodSchema>;
export type PageListBlockDef = z.infer<typeof PageListBlockZodSchema>;
export type PageSetBlockDef = z.infer<typeof PageSetBlockZodSchema>;
export type StaticBlockDef = z.infer<typeof StaticBlockZodSchema>;
export type TagBlockDef = z.infer<typeof TagBlockZodSchema>;
