import { z } from 'zod';
import { BlockType } from './BlockType';

const CommonBlockZodSchema = z.object({
  title: z.string().optional(),
});

export const MediaBlockZodSchema = CommonBlockZodSchema.extend({
  template: z.string(),
  type: z.literal(BlockType.MEDIA),
  src: z.string(),
  gallery: z.string().optional(),
});

export const PageListBlockZodSchema = CommonBlockZodSchema.extend({
  template: z.string().default('block-page-plain-list'),
  type: z.literal(BlockType.PAGE_LIST),
  category: z.string(),
  prev: z.coerce.number().min(0),
  next: z.coerce.number().min(0),
});

export const PageSetBlockZodSchema = CommonBlockZodSchema.extend({
  type: z.literal(BlockType.PAGE_SET),
  template: z.string().default('partial-gallery-set'),
  cardTemplate: z.string().default('fragment-img-card'),
  items: z.array(z.string()),
});

export const SeriesBlockZodSchema = CommonBlockZodSchema.extend({
  type: z.literal(BlockType.SERIES),
  template: z.string().default('partial-gallery-list'),
  cardTemplate: z.string().default('fragment-img-card'),
  category: z.string(),
});

export const StaticBlockZodSchema = CommonBlockZodSchema.extend({
  template: z.string().default('block-plain'),
  type: z.literal(BlockType.STATIC),
  content: z.string(),
});

export const BlockZodSchema = z.discriminatedUnion('type', [
  MediaBlockZodSchema,
  PageListBlockZodSchema,
  PageSetBlockZodSchema,
  SeriesBlockZodSchema,
  StaticBlockZodSchema,
]);

export type BlockDef = z.infer<typeof BlockZodSchema>;
export type GalleryBlockDef = z.infer<typeof SeriesBlockZodSchema>;
export type MediaBlockDef = z.infer<typeof MediaBlockZodSchema>;
export type PageListBlockDef = z.infer<typeof PageListBlockZodSchema>;
export type PageSetBlockDef = z.infer<typeof PageSetBlockZodSchema>;
export type StaticBlockDef = z.infer<typeof StaticBlockZodSchema>;
