import { PageDef } from './PageZodSchema';
import { CmsServiceOptions } from './CmsModuleOptions';
import { Locale } from '@shared/types/Locale';

export interface PageMeta {
  meta: CmsServiceOptions['meta'];
  brand: CmsServiceOptions['brand'];
}

export interface PageProps {
  slug: string;
  series: string | undefined;
  date: string | undefined;
  sort: number | undefined;
  lang: Locale;
  htmlFilename: string;
}

export interface FullPageDef extends PageDef, PageMeta, PageProps {}
