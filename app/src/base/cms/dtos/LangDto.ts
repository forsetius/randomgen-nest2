import type { ValidationConfig } from '@forsetius/glitnir-validation';
import type { Lang } from '@shared/types/Lang';
import z from 'zod';

type ValidationLangConfig = Pick<ValidationConfig, 'langs'>;

function toAppLangsConfig(config: Readonly<ValidationLangConfig>): {
  readonly supported: readonly [Lang, ...Lang[]];
  readonly default: Lang;
} {
  const [firstSupportedLang, ...otherSupportedLangs] = config.langs
    .supported as Lang[];

  if (typeof firstSupportedLang === 'undefined') {
    throw new Error(
      'Expected validation config to define at least one supported language',
    );
  }

  return {
    supported: [firstSupportedLang, ...otherSupportedLangs],
    default: config.langs.default as Lang,
  };
}

export const LangSchema = (config: Readonly<ValidationLangConfig>) => {
  const appLangs = toAppLangsConfig(config);

  return z.object({
    lang: z.enum(appLangs.supported).default(appLangs.default),
  });
};

export const OptionalLangSchema = (config: Readonly<ValidationLangConfig>) => {
  const appLangs = toAppLangsConfig(config);

  return z.object({
    lang: z.enum(appLangs.supported).optional(),
  });
};

export type LangDto = z.infer<ReturnType<typeof LangSchema>>;
