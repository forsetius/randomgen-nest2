import { z } from 'zod';
import { BlockStyle } from './BlockStyle';
import { BlockType } from './BlockType';

const CommonBlockZodSchema = z.object({
  name: z.string(),
  template: z.string(),
  style: z.nativeEnum(BlockStyle),
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
  tag: z.string().optional(),
});

export const PageSetBlockZodSchema = CommonBlockZodSchema.extend({
  type: z.literal(BlockType.PAGE_SET),
  title: z.string(),
  items: z.array(z.string()),
});

export const BlockZodSchema = z.discriminatedUnion('type', [
  ApiCallBlockZodSchema,
  PageBlockZodSchema,
  PageListBlockZodSchema,
  PageSetBlockZodSchema,
]);

export type BlockDef = z.infer<typeof BlockZodSchema>;
