import { Injectable } from '@nestjs/common';
import { BaseGenerator } from './BaseGenerator';
import { Language } from '@shared/types/Language';
import { SourceEn } from '../types/SourceEn';

@Injectable()
export class EnglishGenerator extends BaseGenerator<SourceEn> {
  public constructor() {
    super(Language.EN);
  }

  public generate(): string {
    return [
      this.descriptor.getRandom(),
      this.action.getRandom(),
      this.source.getRandom(),
      this.effect.getRandom(),
      this.device.getRandom(),
    ].join(' ');
  }

  protected override getData() {
    return super.getData(Language.EN);
  }
}
