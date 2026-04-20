import z from 'zod';
import type { ValidationConfig } from '@forsetius/glitnir-validation';

interface TechnobabbleRequestSchemaConfig {
  readonly langs: ValidationConfig['langs'];
  readonly maxResults: number;
}

export const TechnobabbleRequestSchema = (
  config: Readonly<TechnobabbleRequestSchemaConfig>,
) => {
  return z.object({
    lang: z.enum(config.langs.supported).default(config.langs.default),
    repeat: z.coerce.number().int().min(1).max(config.maxResults).default(1),
  });
};

export type TechnobabbleRequestDto = z.infer<
  ReturnType<typeof TechnobabbleRequestSchema>
>;
