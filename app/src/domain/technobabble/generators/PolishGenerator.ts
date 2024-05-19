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

  public generate(datasetName: string): string {
    const dataset = this.getDataset(datasetName);

    const action = dataset.action.getRandom();
    const descriptor = dataset.descriptor.getRandom();
    const source = dataset.source.getRandom();
    const effect = dataset.effect.getRandom();
    const device = dataset.device.getRandom();

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
