import { Lang } from '../../shared/types/Lang';

export const DEFAULT_TECHNOBABBLE_SUPPORTED_LANGS = [
  Lang.EN,
  Lang.PL,
] as const satisfies readonly Lang[];
