import { PageDef } from './PageZodSchema';
import { CmsServiceOptions } from './CmsModuleOptions';
import { Locale } from '@shared/types/Locale';
import { Page } from '../domain/Page';
import { Category } from '../domain/Category';

export interface PageMeta {
  meta: CmsServiceOptions['meta'];
  brand: CmsServiceOptions['brand'];
}

export interface PageProps {
  categoryData: CategoryData | undefined;
  lang: Locale;
  slug: string;
  filename: string;
}

export interface FullPageDef extends PageDef, PageMeta, PageProps {}

export interface CategoryData {
  current: Category;
  prev: Page | undefined;
  next: Page | undefined;
}
