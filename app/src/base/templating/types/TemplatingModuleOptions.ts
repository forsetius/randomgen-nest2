import { ConfigureOptions } from 'nunjucks';

export interface TemplatingModuleOptions {
  paths: string | string[];
  options?: ConfigureOptions;
}
