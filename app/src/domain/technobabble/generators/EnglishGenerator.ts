import { Inject, Injectable } from '@nestjs/common';
import { BaseGenerator } from './BaseGenerator';
import type { Lang } from '../../../shared/types/Lang';
import { SourceEn } from '../types/SourceEn';
import {
  type TechnobabbleModuleConfig,
  TechnobabbleModuleConfigContract,
} from '../types/TechnobabbleModuleConfigContract';

@Injectable()
export class EnglishGenerator extends BaseGenerator<SourceEn> {
  public constructor(
    @Inject(TechnobabbleModuleConfigContract.token)
    config: TechnobabbleModuleConfig,
  ) {
    super(config, 'en' satisfies Lang);
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
