import { Lang } from '@shared/types/Lang';
import { Env } from '@shared/types/Env';

export interface AppModuleOptions {
  title: string;
  description: string;
  version: string;
  env: Env;
  host: string;
  port: number;
  defaultLanguage: Lang;
}
