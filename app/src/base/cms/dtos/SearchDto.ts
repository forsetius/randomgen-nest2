import z from 'zod';
import type { ValidationConfig } from '@forsetius/glitnir-validation';
import { LangSchema } from './LangDto';

type SearchQuerySchemaConfig = Pick<ValidationConfig, 'langs'>;

export const SearchQuerySchema = (config: Readonly<SearchQuerySchemaConfig>) =>
  LangSchema(config).extend({
    count: z.coerce.number().int().min(1).max(10).optional(),
    term: z
      .string()
      .min(3, { message: 'Term must be at least 3 characters long' })
      .regex(/^[\p{L}\d\s-]+$/u),
    brief: z.coerce.boolean().default(false),
  });

export type SearchDto = z.infer<ReturnType<typeof SearchQuerySchema>>;
