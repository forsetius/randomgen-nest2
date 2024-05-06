import { Language } from '@shared/types/Language';

export interface TechnobabblePlDataModel {
  language: Language.PL;
  action: string[];
  descriptor: AdjectiveForms[];
  source: AdjectiveForms[];
  effect: NounForms[];
  device: NounForms[];
}

export type Gender = 'm' | 'f' | 'n' | 'pl';

export type AdjectiveForms = Record<Gender, string>;

export interface NounForms {
  gender: Gender;
  sing: string;
  pl: string;
}
