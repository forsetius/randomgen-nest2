import { Injectable } from '@nestjs/common';
import { BaseGenerator } from './BaseGenerator';
import { Lang } from '@shared/types/Lang';
import { SourceEn } from '../types/SourceEn';

@Injectable()
export class EnglishGenerator extends BaseGenerator<SourceEn> {
  public constructor() {
    super(Lang.EN);
  }

  public generate(datasetName: string): string {
    const dataset = this.getDataset(datasetName);

    return [
      dataset.action.getRandom(),
      dataset.descriptor.getRandom(),
      dataset.source.getRandom(),
      dataset.effect.getRandom(),
      dataset.device.getRandom(),
    ].join(' ');
  }
}
