import { Lang } from '@shared/types/Lang';

export interface CmsModuleOptions {
  appOrigin: string;
  fragmentTemplates: string[];
  supportedLangs: Lang[];
  paths: {
    sourceDir: string;
    outputDir: string;
    mediaDir: string;
    uiDir: string;
  };
  defaults: {
    headerImage: string;
  };
  brand: {
    name: string;
    copyright: string;
    logo: string;
  };
}

export interface SitewideData extends CmsModuleOptions {
  appOrigin: string;
}
