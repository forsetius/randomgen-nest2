import * as fs from 'node:fs';
import { Language } from '@shared/types/Language';
import { SourceKeys, SourceData, BaseSource } from '../types/SourceData';
import { Dataset } from './Dataset';
import { globSync } from 'glob';
import * as path from 'node:path';

export abstract class BaseGenerator<S extends BaseSource> {
  protected datasets: Record<string, Dataset<S>> = {};

  protected constructor(language: Language) {
    const dataFiles = globSync(
      `${__dirname}/../../../../dict/technobabble/*-${language}.json`,
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
