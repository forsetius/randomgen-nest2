import * as fs from 'node:fs';
import * as path from 'node:path';
import { Lang } from '@shared/types/Lang';
import { SourceKeys, SourceData, BaseSource } from '../types/SourceData';
import { Dataset } from './Dataset';

export abstract class BaseGenerator<S extends BaseSource> {
  protected datasets: Record<string, Dataset<S>> = {};

  protected constructor(language: Lang) {
    const dataFiles = fs.globSync(
      `${__dirname}/../../../../content/technobabble/*-${language}.json`,
    );
    dataFiles.forEach((dataFile) => {
      const datasetName = path.basename(dataFile, `-${language}.json`);
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8')) as {
        [K in SourceKeys]: SourceData<S>[K][];
      };

      this.datasets[datasetName] = new Dataset(data);
    });
  }

  abstract generate(datasetName: string): string;

  protected getDataset(name: string): Dataset<S> {
    if (!(name in this.datasets)) {
      throw new Error(`No such template: "${name}"`);
    }

    return this.datasets[name]!;
  }
}
