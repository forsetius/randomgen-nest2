import { Lang } from '@shared/types/Lang';
import { Page } from '../domain/Page';
import { Category } from '../domain/Category';
import { DateTime } from 'luxon';

export interface PageMeta {
  appOrigin: string;
}

export interface PageProps {
  categoryData: CategoryData | undefined;
  lang: Lang;
  translations: Record<string, string>;
  slug: string;
  filename: string;
  dateTime: DateTime | undefined;
}

export interface CategoryData {
  current: Category;
  prev: Page | undefined;
  next: Page | undefined;
}
