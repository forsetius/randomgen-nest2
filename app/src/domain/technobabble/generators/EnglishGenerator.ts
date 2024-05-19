import { Injectable } from '@nestjs/common';
import { BaseGenerator } from './BaseGenerator';
import { Language } from '@shared/types/Language';
import { SourceEn } from '../types/SourceEn';

@Injectable()
export class EnglishGenerator extends BaseGenerator<SourceEn> {
  public constructor() {
    super(Language.EN);
  }

  public generate(datasetName: string): string {
    const dataset = this.getDataset(datasetName);

    return [
      dataset.descriptor.getRandom(),
      dataset.action.getRandom(),
      dataset.source.getRandom(),
      dataset.effect.getRandom(),
      dataset.device.getRandom(),
    ].join(' ');
  }
}
