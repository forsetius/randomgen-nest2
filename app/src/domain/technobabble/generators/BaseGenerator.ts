import * as fs from 'node:fs';
import { Language } from '@shared/types/Language';
import { RollableCollection } from '@shared/util/RollableCollection';
import { SourceKeys, SourceData, BaseSource } from '../types/SourceData';

export abstract class BaseGenerator<S extends BaseSource> {
  public readonly action: RollableCollection<SourceData<S>[SourceKeys.ACTION]>;
  public readonly descriptor: RollableCollection<
    SourceData<S>[SourceKeys.DESCRIPTOR]
  >;
  public readonly source: RollableCollection<SourceData<S>[SourceKeys.SOURCE]>;
  public readonly effect: RollableCollection<SourceData<S>[SourceKeys.EFFECT]>;
  public readonly device: RollableCollection<SourceData<S>[SourceKeys.DEVICE]>;

  protected constructor(language: Language) {
    const data = this.getData(language);

    this.action = new RollableCollection(data.action);
    this.descriptor = new RollableCollection(data.descriptor);
    this.source = new RollableCollection(data.source);
    this.effect = new RollableCollection(data.effect);
    this.device = new RollableCollection(data.device);
  }

  abstract generate(): string;

  protected getData(language: Language): {
    [K in SourceKeys]: SourceData<S>[K][];
  } {
    return JSON.parse(
      fs.readFileSync(
        `../../../../dict/technobabble/*-${language}.json`,
        'utf-8',
      ),
    );
  }
}
