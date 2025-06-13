import { Lang } from '@shared/types/Lang';

export interface CmsModuleOptions {
  fragmentTemplates: string[];
  meta: Record<
    Lang,
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
    lang: Lang;
  };
  brand: {
    name: string;
    copyright: string;
    logo: string;
  };
}
