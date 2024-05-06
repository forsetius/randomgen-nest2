import { TechnobabbleEnDataModel } from './TechnobabbleEnDataModel';
import { TechnobabblePlDataModel } from './TechnobabblePlDataModel';

export type TechnobabbleBaseDataModel =
  | TechnobabbleEnDataModel
  | TechnobabblePlDataModel;
