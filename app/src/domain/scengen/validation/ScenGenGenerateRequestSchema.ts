import z from 'zod';
import { AppConfigService } from '@config/AppConfigService';

export const ScenGenGenerateRequestSchema = (config: AppConfigService) => {
  const defaultLang = config.get('app.defaultLanguage');
  const scenGenConfig = config.get('scengen');

  return z
    .object({
      setting: z.string(),
      scenarioPattern: z.string(),
      theme: z.string().optional(),
      location: z.string().optional(),
      lang: z.enum(scenGenConfig.supportedLangs).prefault(defaultLang),
    })
    .transform(({ location, theme, ...rest }) => ({
      location,
      theme,
      ...rest,
    }));
};

export type ScenGenGenerateRequestDto = z.infer<
  ReturnType<typeof ScenGenGenerateRequestSchema>
>;
