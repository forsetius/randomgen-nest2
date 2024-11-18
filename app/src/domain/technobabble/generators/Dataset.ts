import { RollableCollection } from '@shared/util/struct/RollableCollection';
import { BaseSource, SourceData, SourceKeys } from '../types/SourceData';

export class Dataset<S extends BaseSource> {
  public readonly action: RollableCollection<SourceData<S>[SourceKeys.ACTION]>;
  public readonly descriptor: RollableCollection<
    SourceData<S>[SourceKeys.DESCRIPTOR]
  >;
  public readonly source: RollableCollection<SourceData<S>[SourceKeys.SOURCE]>;
  public readonly effect: RollableCollection<SourceData<S>[SourceKeys.EFFECT]>;
  public readonly device: RollableCollection<SourceData<S>[SourceKeys.DEVICE]>;

  public constructor(data: Data<S>) {
    this.action = new RollableCollection(data.action);
    this.descriptor = new RollableCollection(data.descriptor);
    this.source = new RollableCollection(data.source);
    this.effect = new RollableCollection(data.effect);
    this.device = new RollableCollection(data.device);
  }
}

type Data<S extends BaseSource> = {
  [K in SourceKeys]: SourceData<S>[K][];
};
