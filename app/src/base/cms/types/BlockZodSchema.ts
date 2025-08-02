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

export const MediaGalleryBlockZodSchema = CommonBlockZodSchema.extend({
  template: z.string().default('lightbox-gallery'),
  type: z.literal(BlockType.MEDIA_GALLERY),
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
}).catchall(z.string());

export const PageGalleryBlockZodSchema = CommonBlockZodSchema.extend({
  type: z.literal(BlockType.PAGE_GALLERY),
  template: z.string().default('partial-gallery-set'),
  content: z.string().optional(),
  cardTemplate: z.string().default('fragment-img-card'),
  count: z.number().int().default(6),
  columns: z.number().int().min(1).max(6).default(3),
  sortDir: z.enum(['asc', 'desc']).default('asc'),
  sources: z.array(
    z
      .object({
        items: z.array(z.string()),
      })
      .or(
        z.object({
          category: z.string(),
          subcategory: z.string().optional(),
        }),
      )
      .or(
        z.object({
          tag: z.string(),
        }),
      ),
  ),
});

export const BlockZodSchema = z.discriminatedUnion('type', [
  ApiCallBlockZodSchema,
  MediaGalleryBlockZodSchema,
  MediaBlockZodSchema,
  PageGalleryBlockZodSchema,
  StaticBlockZodSchema,
]);

export type BlockDef = z.infer<typeof BlockZodSchema>;
export type ApiCallBlockDef = z.infer<typeof ApiCallBlockZodSchema>;
export type GalleryBlockDef = z.infer<typeof MediaGalleryBlockZodSchema>;
export type MediaBlockDef = z.infer<typeof MediaBlockZodSchema>;
export type StaticBlockDef = z.infer<typeof StaticBlockZodSchema>;
export type PageGalleryBlockDef = z.infer<typeof PageGalleryBlockZodSchema>;
