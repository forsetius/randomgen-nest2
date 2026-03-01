import z from 'zod';
import { AppConfigService } from '@config/AppConfigService';

export const MissionPatternRequestSchema = (config: AppConfigService) => {
  const defaultLang = config.get('app.defaultLanguage');
  const scenGenConfig = config.get('scengen');

  return z
    .object({
      setting: z.string(),
      theme: z.string().optional(),
      location: z.string().optional(),
      friendlyFaction: z.string().optional(),
      enemyFaction: z.string().optional(),
      travelScenes: z.number().int().min(0).max(4).default(1),
      mainSiteType: z.string().optional(),
      lang: z.enum(scenGenConfig.supportedLangs).prefault(defaultLang),
    })
    .transform(({ location, theme, mainSiteType, ...rest }) => ({
      location,
      theme,
      mainSiteType,
      ...rest,
    }));
};

export type MissionPatternRequestDto = z.infer<
  ReturnType<typeof MissionPatternRequestSchema>
>;
