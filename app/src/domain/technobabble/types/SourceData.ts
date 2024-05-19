export enum SourceKeys {
  ACTION = 'action',
  DESCRIPTOR = 'descriptor',
  SOURCE = 'source',
  EFFECT = 'effect',
  DEVICE = 'device',
}
export type BaseSource = Record<SourceKeys, any[]>;

export type SourceData<T extends BaseSource> = {
  [K in SourceKeys]: T[K][number];
};
