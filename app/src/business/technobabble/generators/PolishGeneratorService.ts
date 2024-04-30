import { Injectable } from '@nestjs/common';
import { BaseGeneratorService } from './BaseGeneratorService';
import {
  AdjectiveForms,
  Gender,
  NounForms,
  TechnobabblePlDataModel,
} from '../types/TechnobabblePlDataModel';
import { RollableCollection } from '../../../shared/util/RollableCollection';
import { flipCoin } from '../../../shared/util/random';

@Injectable()
export class PolishGeneratorService extends BaseGeneratorService<TechnobabblePlDataModel> {
  protected declare action: RollableCollection<string>;
  protected declare descriptor: RollableCollection<AdjectiveForms>;
  protected declare source: RollableCollection<AdjectiveForms>;
  protected declare effect: RollableCollection<NounForms>;
  protected declare device: RollableCollection<NounForms>;

  public constructor() {
    super('startrek-pl');
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
}
