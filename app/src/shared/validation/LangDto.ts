import { Lang } from '@shared/types/Lang';
import type { AppConfigService } from '@config/AppConfigService';
import z from 'zod';

export const LangSchema = (config: AppConfigService) => {
  const defaultLang = config.getInferred('app.defaultLanguage');

  return z.object({
    lang: z.enum(Lang).default(defaultLang),
  });
};

export const OptionalLangSchema = z.object({
  lang: z.enum(Lang).optional(),
});

export type LangDto = z.infer<ReturnType<typeof LangSchema>>;
export type OptionalLangDto = z.infer<typeof OptionalLangSchema>;
