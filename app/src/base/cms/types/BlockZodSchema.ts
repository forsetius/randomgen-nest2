import { z } from 'zod';
import { BlockType } from './BlockType';

const CommonBlockZodSchema = z.object({
  title: z.string().optional(),
});

export const ApiCallBlockZodSchema = CommonBlockZodSchema.extend({
  type: z.literal(BlockType.API_CALL),
  template: z.string(),
  url: z.string(),
});

export const GalleryBlockZodSchema = CommonBlockZodSchema.extend({
  template: z.string().default('lightbox-gallery'),
  type: z.literal(BlockType.GALLERY),
  items: z.array(
    z.object({
      template: z.string().default('lightbox-image'),
      src: z.string(),
      title: z.string().optional(),
    }),
  ),
});

export const MediaBlockZodSchema = CommonBlockZodSchema.extend({
  template: z.string(),
  type: z.literal(BlockType.MEDIA),
  src: z.string(),
  gallery: z.string().optional(),
});

export const StaticBlockZodSchema = CommonBlockZodSchema.extend({
  template: z.string().default('block-plain'),
  type: z.literal(BlockType.STATIC),
  content: z.string(),
});

const SetBlockZodSchema = CommonBlockZodSchema.extend({
  template: z.string().default('partial-gallery-set'),
  cardTemplate: z.string().default('fragment-img-card'),
  count: z.number().default(6),
  sortDir: z.enum(['asc', 'desc']).default('asc'),
});

export const CategoryBlockZodSchema = SetBlockZodSchema.extend({
  type: z.literal(BlockType.CATEGORY),
  category: z.string(),
});

export const PageSetBlockZodSchema = SetBlockZodSchema.extend({
  type: z.literal(BlockType.PAGE_SET),
  items: z.array(z.string()),
});

export const TagBlockZodSchema = SetBlockZodSchema.extend({
  type: z.literal(BlockType.TAG),
  tag: z.string(),
});

export const BlockZodSchema = z.discriminatedUnion('type', [
  ApiCallBlockZodSchema,
  CategoryBlockZodSchema,
  GalleryBlockZodSchema,
  MediaBlockZodSchema,
  PageSetBlockZodSchema,
  StaticBlockZodSchema,
  TagBlockZodSchema,
]);

export type BlockDef = z.infer<typeof BlockZodSchema>;
export type ApiCallBlockDef = z.infer<typeof ApiCallBlockZodSchema>;
export type CategoryBlockDef = z.infer<typeof CategoryBlockZodSchema>;
export type GalleryBlockDef = z.infer<typeof GalleryBlockZodSchema>;
export type MediaBlockDef = z.infer<typeof MediaBlockZodSchema>;
export type PageSetBlockDef = z.infer<typeof PageSetBlockZodSchema>;
export type StaticBlockDef = z.infer<typeof StaticBlockZodSchema>;
export type TagBlockDef = z.infer<typeof TagBlockZodSchema>;
