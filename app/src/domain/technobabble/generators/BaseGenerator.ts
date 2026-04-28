import * as fs from 'node:fs';
import * as path from 'node:path';
import { Lang } from '../../../shared/types/Lang';
import { SourceKeys, SourceData, BaseSource } from '../types/SourceData';
import { Dataset } from './Dataset';
import { APP_ROOT } from '../../../appConstants';
import { type TechnobabbleModuleConfig } from '../types/TechnobabbleModuleConfigContract';

export abstract class BaseGenerator<S extends BaseSource> {
  protected datasets: Record<string, Dataset<S>> = {};

  protected constructor(
    protected readonly config: TechnobabbleModuleConfig,
    language: Lang,
  ) {
    const technobabbleContentDirectory = path.join(APP_ROOT, config.contentDir);
    const dataFiles = fs
      .globSync(`*-${language}.json`, {
        cwd: technobabbleContentDirectory,
      })
      .map((dataFile) => path.join(technobabbleContentDirectory, dataFile))
      .sort();

    for (const dataFile of dataFiles) {
      const datasetName = path.basename(dataFile, `-${language}.json`);
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8')) as {
        [K in SourceKeys]: SourceData<S>[K][];
      };

      this.datasets[datasetName] = new Dataset(data);
    }
  }

  abstract generate(datasetName: string): string;

  protected getDataset(name: string): Dataset<S> {
    if (!(name in this.datasets)) {
      throw new Error(`No such template: "${name}"`);
    }

    return this.datasets[name]!;
  }
}
