import z from 'zod';
import type { AppConfigService } from '@config/AppConfigService';
import { LangSchema } from './LangDto';

export const SearchQuerySchema = (config: AppConfigService) =>
  LangSchema(config).extend({
    count: z.coerce.number().int().min(1).max(10).optional(),
    term: z
      .string()
      .min(3, { message: 'Term must be at least 3 characters long' })
      .regex(/^[\p{L}\d\s-]+$/u),
    brief: z.coerce.boolean().default(false),
  });

export type SearchDto = z.infer<ReturnType<typeof SearchQuerySchema>>;
