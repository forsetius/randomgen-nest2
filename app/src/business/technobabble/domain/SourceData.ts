import { TechnobabbleBaseDataModel } from '../types/TechnobabbleBaseDataModel';
import fs from 'node:fs';

export class SourceData {
  private store: Map<Name, TechnobabbleBaseDataModel>;

  public constructor(filename: string) {}

  protected getSourceData(filename: string): SourceDataModel {
    return JSON.parse(
      fs.readFileSync(
        `${__dirname}/../../../../dict/technobabble/${filename}.json`,
        'utf-8',
      ),
    ) as SourceDataModel;
  }
}

type Name = string;
