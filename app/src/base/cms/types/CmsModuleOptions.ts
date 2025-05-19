import { Locale } from '@shared/types/Locale';

export interface CmsModuleOptions {
  fragmentTemplates: string[];
  meta: Record<
    Locale,
    {
      title: string;
      description: string;
      keywords: string;
    }
  >;
  brand: {
    name: string;
    copyright: string;
    logo: string;
  };
}

export interface CmsServiceOptions {
  fragmentTemplates: string[];
  meta: {
    title: string;
    description: string;
    keywords: string;
    lang: Locale;
  };
  brand: {
    name: string;
    copyright: string;
    logo: string;
  };
}
