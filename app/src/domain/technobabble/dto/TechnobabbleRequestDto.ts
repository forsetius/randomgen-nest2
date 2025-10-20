import z from 'zod';
import { AppConfigService } from '@config/AppConfigService';

export const TechnobabbleRequestSchema = (config: AppConfigService) => {
  const defaultLang = config.get('app.defaultLanguage');
  const supportedLangs = config.get('technobabble.supportedLangs');

  return z.object({
    lang: z.enum(supportedLangs).prefault(defaultLang),
    repeat: z.coerce
      .number()
      .int()
      .min(1)
      .max(config.get('technobabble.maxResults'))
      .default(1),
  });
};

export type TechnobabbleRequestDto = z.infer<
  ReturnType<typeof TechnobabbleRequestSchema>
>;
