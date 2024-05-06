import { Injectable } from '@nestjs/common';
import { BaseGenerator } from './BaseGenerator';
import {
  AdjectiveForms,
  Gender,
  NounForms,
  TechnobabblePlDataModel,
} from '../types/TechnobabblePlDataModel';
import { flipCoin } from '@shared/util/random';
import { RollableCollection } from '@shared/util/RollableCollection';

@Injectable()
export class PolishGenerator extends BaseGenerator<TechnobabblePlDataModel> {
  public constructor() {
    super(DatasetPl);
  }

  public generate(sourceTemplateName: string): string {
    const dataset = this.getDataset(sourceTemplateName);

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
}

class DatasetPl {
  public readonly action: RollableCollection<string>;
  public readonly descriptor: RollableCollection<AdjectiveForms>;
  public readonly source: RollableCollection<AdjectiveForms>;
  public readonly effect: RollableCollection<NounForms>;
  public readonly device: RollableCollection<NounForms>;

  public constructor(data: TechnobabblePlDataModel) {
    this.action = new RollableCollection(data.action);
    this.descriptor = new RollableCollection(data.descriptor);
    this.source = new RollableCollection(data.source);
    this.effect = new RollableCollection(data.effect);
    this.device = new RollableCollection(data.device);
  }
}
