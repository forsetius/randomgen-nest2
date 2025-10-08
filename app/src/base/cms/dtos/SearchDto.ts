import z from 'zod';
import type { AppConfigService } from '@config/AppConfigService';
import { LangSchema } from '@shared/validation/LangDto';

export const SearchQuerySchema = (config: AppConfigService) =>
  LangSchema(config).extend({
    count: z.coerce.number().int().min(1).max(10).optional(),
    term: z.string().regex(/^[\p{L}\d\s-]+$/u),
    brief: z.coerce.boolean().default(false),
  });

export type SearchDto = z.infer<ReturnType<typeof SearchQuerySchema>>;
