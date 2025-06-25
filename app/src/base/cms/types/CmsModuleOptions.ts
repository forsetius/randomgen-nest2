export interface CmsModuleOptions {
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
