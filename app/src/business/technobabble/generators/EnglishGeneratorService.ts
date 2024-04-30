import { Injectable } from '@nestjs/common';
import { BaseGeneratorService } from './BaseGeneratorService';
import { RollableCollection } from '../../../shared/util/RollableCollection';
import { TechnobabbleEnDataModel } from '../types/TechnobabbleEnDataModel';

@Injectable()
export class EnglishGeneratorService extends BaseGeneratorService<TechnobabbleEnDataModel> {
  protected declare action: RollableCollection<string>;
  protected declare descriptor: RollableCollection<string>;
  protected declare source: RollableCollection<string>;
  protected declare effect: RollableCollection<string>;
  protected declare device: RollableCollection<string>;

  public constructor() {
    super('startrek-en');
  }

  public generate(): string {
    return [
      this.action.getRandom(),
      this.descriptor.getRandom(),
      this.source.getRandom(),
      this.effect.getRandom(),
      this.device.getRandom(),
    ].join(' ');
  }
}
