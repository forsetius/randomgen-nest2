import { Injectable } from '@nestjs/common';
import { BaseGenerator } from './BaseGenerator';
import { TechnobabbleEnDataModel } from '../types/TechnobabbleEnDataModel';
import { RollableCollection } from '@shared/util/RollableCollection';

@Injectable()
export class EnglishGenerator extends BaseGenerator<TechnobabbleEnDataModel> {
  public constructor() {
    super(DatasetEn);
  }

  public generate(sourceTemplateName: string): string {
    const dataset = this.getDataset(sourceTemplateName);

    return [
      dataset.descriptor.getRandom(),
      dataset.action.getRandom(),
      dataset.source.getRandom(),
      dataset.effect.getRandom(),
      dataset.device.getRandom(),
    ].join(' ');
  }
}

class DatasetEn {
  public readonly action: RollableCollection<string>;
  public readonly descriptor: RollableCollection<string>;
  public readonly source: RollableCollection<string>;
  public readonly effect: RollableCollection<string>;
  public readonly device: RollableCollection<string>;

  public constructor(data: TechnobabbleEnDataModel) {
    this.action = new RollableCollection(data.action);
    this.descriptor = new RollableCollection(data.descriptor);
    this.source = new RollableCollection(data.source);
    this.effect = new RollableCollection(data.effect);
    this.device = new RollableCollection(data.device);
  }
}
