import { TechnobabbleBaseDataModel } from './TechnobabbleBaseDataModel';

export interface TechnobabbleEnDataModel extends TechnobabbleBaseDataModel {
  action: string[];
  descriptor: string[];
  source: string[];
  effect: string[];
  device: string[];
}
