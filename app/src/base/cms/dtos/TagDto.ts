import z from 'zod';
import { LangDto } from './LangDto';

export const TagParamSchema = z.object({
  tag: z.string().regex(/^[\p{L}\d\s-]+$/u),
});

export type TagDto = z.infer<typeof TagParamSchema> & LangDto;
