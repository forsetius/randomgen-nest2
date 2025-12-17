import { z } from 'zod';
import { Lang } from '@shared/types/Lang';

export const ScenGenConfigSchema = z.object({
  supportedLangs: z.array(z.enum(Lang)).nonempty(),
  sourceDir: z.string(),
});

export type ScenGenModuleOptions = z.infer<typeof ScenGenConfigSchema>;
