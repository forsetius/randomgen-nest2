import { z } from 'zod';
import { BlockType } from './BlockType';

const CommonBlockZodSchema = z.object({
  title: z.string().optional(),
});

export const GalleryBlockZodSchema = CommonBlockZodSchema.extend({
  type: z.literal(BlockType.GALLERY),
  template: z.string().default('partial-gallery'),
  cardTemplate: z.string().default('fragment-img-card'),
  series: z.string(),
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
  series: z.string(),
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

export const BlockZodSchema = z.discriminatedUnion('type', [
  GalleryBlockZodSchema,
  MediaBlockZodSchema,
  PageListBlockZodSchema,
  PageSetBlockZodSchema,
  StaticBlockZodSchema,
]);

export type BlockDef = z.infer<typeof BlockZodSchema>;
export type GalleryBlockDef = z.infer<typeof GalleryBlockZodSchema>;
export type MediaBlockDef = z.infer<typeof MediaBlockZodSchema>;
export type PageListBlockDef = z.infer<typeof PageListBlockZodSchema>;
export type PageSetBlockDef = z.infer<typeof PageSetBlockZodSchema>;
export type StaticBlockDef = z.infer<typeof StaticBlockZodSchema>;
