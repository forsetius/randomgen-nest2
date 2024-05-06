import * as fs from 'node:fs';
import { globSync } from 'glob';
import { TechnobabbleBaseDataModel } from '../types/TechnobabbleBaseDataModel';
import { Language } from '@shared/types/Language';
import * as path from 'node:path';
import { Dataset } from '../types/Dataset';
import { RollableCollection } from '@shared/util/RollableCollection';

export abstract class BaseGenerator<
  DataModel extends TechnobabbleBaseDataModel,
> {
  protected datasets: Map<string, Dataset<DataModel>> = new Map();
  public readonly action: RollableCollection<DataModel['action']>;
  public readonly descriptor: RollableCollection<DataModel['descriptor']>;
  public readonly source: RollableCollection<DataModel['source']>;
  public readonly effect: RollableCollection<DataModel['effect']>;
  public readonly device: RollableCollection<DataModel['device']>;

  protected constructor(language: Language) {
    const dicts = globSync(`../../../../dict/technobabble/*-${language}.json`);
    const data = JSON.parse(fs.readFileSync(dicts[0]!, 'utf-8')) as DataModel;
    this.device = new RollableCollection(data.device);

    dicts.forEach((sourceFile) => {});
  }

  abstract generate(sourceTemplateName: string): string;

  protected getDataset(sourceTemplateName: string): Dataset<DataModel> {
    if (!this.datasets.has(sourceTemplateName)) {
      throw new Error('No such template name');
    }

    return this.datasets.get(sourceTemplateName)!;
  }
}
