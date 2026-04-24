import { Lang } from '../../shared/types/Lang';
import { Env } from '../../shared/types/Env';

export interface AppModuleOptions {
  env: Env;
  host: string;
  origin: string;
  port: number;
  langs: {
    supported: readonly [Lang, ...Lang[]];
    default: Lang;
    charset: 'utf-8';
  };
}
