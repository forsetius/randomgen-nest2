import z from 'zod';
import { Lang } from '@shared/types/Lang';
import { AppConfigService } from '@config/AppConfigService';

export const TechnobabbleRequestSchema = (config: AppConfigService) => {
  const defaultLang = config.getInferred('app.defaultLanguage');

  return z.object({
    lang: z.enum(Lang).default(defaultLang),
    repeat: z.coerce.number().int().min(1).max(20).default(1),
  });
};

export type TechnobabbleRequestDto = z.infer<
  ReturnType<typeof TechnobabbleRequestSchema>
>;
