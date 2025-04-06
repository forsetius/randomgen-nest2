import { Locale } from '@shared/types/Locale';
import { Page } from '../domain';
import { PageDef } from './PageZodSchema';

export type PageFactory = (slug: string, def: PageDef, locale: Locale) => Page;
