import * as fs from 'node:fs';
import { Language } from '@shared/types/Language';
import { RollableCollection } from '@shared/util/RollableCollection';
import { SourceData, SourceKeys } from '../types/SourceData';

export abstract class BaseGenerator<L extends Language> {
  public readonly action: RollableCollection<SourceData[L][SourceKeys.ACTION]>;
  public readonly descriptor: RollableCollection<
    SourceData[L][SourceKeys.DESCRIPTOR]
  >;
  public readonly source: RollableCollection<SourceData[L][SourceKeys.SOURCE]>;
  public readonly effect: RollableCollection<SourceData[L][SourceKeys.EFFECT]>;
  public readonly device: RollableCollection<SourceData[L][SourceKeys.DEVICE]>;

  protected constructor(language: L) {
    const data = this.getData(language);

    this.action = new RollableCollection(data.action);
    this.descriptor = new RollableCollection(data.descriptor);
    this.source = new RollableCollection(data.source);
    this.effect = new RollableCollection(data.effect);
    this.device = new RollableCollection(data.device);
  }

  abstract generate(): string;

  protected getData(language: Language): {
    [K in SourceKeys]: SourceData[L][K][];
  } {
    return JSON.parse(
      fs.readFileSync(
        `../../../../dict/technobabble/*-${language}.json`,
        'utf-8',
      ),
    );
  }
}
