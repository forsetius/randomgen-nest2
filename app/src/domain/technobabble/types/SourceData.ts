import { Language } from '@shared/types/Language';
import { SourceEn } from './SourceEn';
import { SourcePl } from './SourcePl';

export enum SourceKeys {
  ACTION = 'action',
  DESCRIPTOR = 'descriptor',
  SOURCE = 'source',
  EFFECT = 'effect',
  DEVICE = 'device',
}

type ToBaseSource<T extends Record<SourceKeys, any[]>> = {
  [K in SourceKeys]: T[K][number];
};

export interface SourceData {
  [Language.EN]: ToBaseSource<SourceEn>;
  [Language.PL]: ToBaseSource<SourcePl>;
}
