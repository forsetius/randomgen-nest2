import { z } from 'zod';
import { BlockType } from './BlockType';

const CommonBlockZodSchema = z.object({
  title: z.string().optional(),
});

export const ApiCallBlockZodSchema = CommonBlockZodSchema.extend({
  template: z.string(),
  type: z.literal(BlockType.API_CALL),
  url: z.string().url(),
});

export const PageBlockZodSchema = CommonBlockZodSchema.extend({
  template: z.string().default('block-page-plain'),
  type: z.literal(BlockType.PAGE),
  slug: z.string(),
});

export const PageListBlockZodSchema = CommonBlockZodSchema.extend({
  template: z.string().default('block-page-plain-list'),
  type: z.literal(BlockType.PAGE_LIST),
  prev: z.coerce.number().min(0),
  next: z.coerce.number().min(0),
});

export const PageSetBlockZodSchema = CommonBlockZodSchema.extend({
  template: z.string().default('block-page-plain-list'),
  type: z.literal(BlockType.PAGE_SET),
  items: z.array(z.string()),
});

export const StaticBlockZodSchema = CommonBlockZodSchema.extend({
  template: z.string().default('block-plain'),
  type: z.literal(BlockType.STATIC),
  content: z.string(),
});

export const TagBlockZodSchema = CommonBlockZodSchema.extend({
  template: z.string().default('block-page-plain-list'),
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
