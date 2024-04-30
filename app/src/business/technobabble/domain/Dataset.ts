import { RollableCollection } from '../../../shared/util/RollableCollection';
import { TechnobabbleBaseDataModel } from '../types/TechnobabbleBaseDataModel';

export class Dataset<T extends TechnobabbleBaseDataModel> {
  public readonly action: RollableCollection<T['action']>;
  public readonly descriptor: RollableCollection<T['descriptor']>;
  public readonly source: RollableCollection<T['source']>;
  public readonly effect: RollableCollection<T['effect']>;
  public readonly device: RollableCollection<T['device']>;

  public constructor(data: TechnobabbleBaseDataModel) {
    this.action = new RollableCollection(data.action);
    this.descriptor = new RollableCollection(data.descriptor);
    this.source = new RollableCollection(data.source);
    this.effect = new RollableCollection(data.effect);
    this.device = new RollableCollection(data.device);
  }
}
