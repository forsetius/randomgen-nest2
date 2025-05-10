import { config } from '../../../config';
import { Locale } from '@shared/types/Locale';
import { PageDef } from './PageZodSchema';

type configType = ReturnType<typeof config>;

export interface PageMeta {
  meta: configType['cms']['meta']['pl'];
  brand: configType['cms']['brand'];
  locale: Locale;
}

export interface FullPageDef extends PageDef, PageMeta {
  slug: string;
  date?: string;
}
