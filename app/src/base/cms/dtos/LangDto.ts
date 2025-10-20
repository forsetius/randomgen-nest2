import type { AppConfigService } from '@config/AppConfigService';
import z from 'zod';

export const LangSchema = (config: AppConfigService) => {
  const defaultLang = config.get('app.defaultLanguage');
  const supportedLangs = config.get('cms.supportedLangs');

  return z.object({
    lang: z.enum(supportedLangs).prefault(defaultLang),
  });
};

export const OptionalLangSchema = (config: AppConfigService) => {
  const supportedLangs = config.get('cms.supportedLangs');

  return z.object({
    lang: z.enum(supportedLangs).optional(),
  });
};

export type LangDto = z.infer<ReturnType<typeof LangSchema>>;
