import { PageDef } from './PageDef';
import { Locale } from '@shared/types/Locale';
import { Page } from '../domain';

export type PageFactory = (slug: string, def: PageDef, locale: Locale) => Page;
