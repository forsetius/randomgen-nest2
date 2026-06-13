import z from 'zod';
import type { ValidationConfig } from '@forsetius/glitnir-validation';

interface StarSystemRequestSchemaConfig {
  readonly langs: ValidationConfig['langs'];
}

export const StarSystemRequestSchema = (
  config: Readonly<StarSystemRequestSchemaConfig>,
) => {
  return z.object({
    lang: z.enum(config.langs.supported).default(config.langs.default),
  });
};

export type StarSystemRequestDto = z.infer<
  ReturnType<typeof StarSystemRequestSchema>
>;
