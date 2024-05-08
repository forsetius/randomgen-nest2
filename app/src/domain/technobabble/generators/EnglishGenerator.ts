import { Injectable } from '@nestjs/common';
import { BaseGenerator } from './BaseGenerator';
import { Language } from '@shared/types/Language';

@Injectable()
export class EnglishGenerator extends BaseGenerator<Language.EN> {
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
