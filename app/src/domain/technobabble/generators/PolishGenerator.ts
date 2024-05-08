import { Injectable } from '@nestjs/common';
import { BaseGenerator } from './BaseGenerator';
import { AdjectiveForms, Gender, NounForms, SourcePl } from '../types/SourcePl';
import { flipCoin } from '@shared/util/random';
import { Language } from '@shared/types/Language';

@Injectable()
export class PolishGenerator extends BaseGenerator<SourcePl> {
  public constructor() {
    super(Language.PL);
  }

  public generate(): string {
    const action = this.action.getRandom();
    const descriptor = this.descriptor.getRandom();
    const source = this.source.getRandom();
    const effect = this.effect.getRandom();
    const device = this.device.getRandom();

    const isEffectPlural = flipCoin();
    const isDevicePlural = flipCoin();

    return [
      action,
      this.pickAdjectiveForm(descriptor, device.gender, isDevicePlural),
      this.pickNounForm(device, isDevicePlural),
      this.pickNounForm(effect, isEffectPlural),
      this.pickAdjectiveForm(source, effect.gender, isEffectPlural),
    ].join(' ');
  }

  private pickAdjectiveForm(
    forms: AdjectiveForms,
    gender: Gender,
    isPlural: boolean,
  ) {
    return isPlural ? forms.pl : forms[gender];
  }

  private pickNounForm(forms: NounForms, isPlural: boolean) {
    return isPlural ? forms.pl : forms.sing;
  }

  protected override getData() {
    return super.getData(Language.PL);
  }
}
