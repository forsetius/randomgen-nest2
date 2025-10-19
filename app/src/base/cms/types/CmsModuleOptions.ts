export interface CmsModuleOptions {
  appHost: string;
  fragmentTemplates: string[];
  paths: {
    mediaDir: string;
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
