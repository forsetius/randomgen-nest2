import { TechnobabbleBaseDataModel } from './TechnobabbleBaseDataModel';
import { RollableCollection } from '@shared/util/RollableCollection';

export class Dataset<T extends TechnobabbleBaseDataModel> {
  public readonly action: RollableCollection<T['action']>;
  public readonly descriptor: RollableCollection<T['descriptor']>;
  public readonly source: RollableCollection<T['source']>;
  public readonly effect: RollableCollection<T['effect']>;
  public readonly device: RollableCollection<T['device']>;

  public constructor(data: T) {
    this.device = new RollableCollection<T>(data.device);
  }
}
