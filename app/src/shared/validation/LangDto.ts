import { Lang } from '@shared/types/Lang';
import type { AppConfigService } from '@config/AppConfigService';
import z from 'zod';

export const LangSchema = (config: AppConfigService) => {
  const defaultLang = config.getInferred('app.defaultLanguage');

  return z.object().extend({
    lang: z.enum(Lang).default(defaultLang),
  });
};

export type LangDto = z.infer<ReturnType<typeof LangSchema>>;
