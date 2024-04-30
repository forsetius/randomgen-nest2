import * as fs from 'node:fs';
import { RollableCollection } from '../../../shared/util/RollableCollection';
import { TechnobabbleBaseDataModel } from '../types/TechnobabbleBaseDataModel';
import { SourceTemplateName } from '../types/SourceTemplateName';
import { Language } from '../../../shared/types/Language';

export abstract class BaseGeneratorService<
  SourceDataModel extends TechnobabbleBaseDataModel,
> {
  private store: Map<string, SourceDataModel> = new Map();

  protected constructor(language: Language) {
    const dicts = this.listDictsForLanguage(language);
  }

  abstract generate(sourceTemplateName: SourceTemplateName): string;

  protected listDictsForLanguage(language: Language): string[] {
    return fs.globSync;
  }

  protected getSourceData(filename: string): SourceDataModel {
    return JSON.parse(
      fs.readFileSync(
        `${__dirname}/../../../../dict/technobabble/${filename}.json`,
        'utf-8',
      ),
    ) as SourceDataModel;
  }
}
