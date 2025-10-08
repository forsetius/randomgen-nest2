import type { LangDto } from '@shared/validation/LangDto';
import z from 'zod';

export const TagParamSchema = z.object({
  tag: z.string().regex(/^[\p{L}\d\s-]+$/u),
});

export type TagDto = z.infer<typeof TagParamSchema> & LangDto;
