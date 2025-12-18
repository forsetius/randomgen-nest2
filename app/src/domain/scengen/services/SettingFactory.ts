import path from 'path';
import { Injectable } from '@nestjs/common';
import {
  EntityData,
  FactionData,
  LocationData,
} from '@domain/scengen/types/SettingModel';
import { Setting } from '@domain/scengen/domain/Setting';
import { getBasename } from '@shared/util/string';
import { LoaderService } from '../../../base/parser/services/LoaderService';
import { Location } from '@domain/scengen/domain/Location';
import { Faction } from '@domain/scengen/domain/Faction';
import { SourceDataZodSchema } from '@domain/scengen/validation/SourceDataZodSchema';
import { EntityKind } from '../types/EntityKind';

@Injectable()
export class SettingFactory {
  public constructor(private readonly loaderService: LoaderService) {}

  public async createFromDirectory(
    directory: string,
    zodSchema: typeof SourceDataZodSchema,
  ): Promise<Setting> {
    const name = path.basename(directory);
    const setting = new Setting(name);

    for await (const loaded of this.loaderService.loadAndParse(
      directory,
      zodSchema,
    )) {
      const id = getBasename(loaded.filename);
      this.addEntity(setting, id, loaded.data as EntityData);
    }
    setting.interlink();

    return setting;
  }

  public addEntity(setting: Setting, id: string, source: EntityData): void {
    switch (source.kind) {
      case EntityKind.FACTION:
        setting.factions.set(id, new Faction(id, source as FactionData));
        break;
      case EntityKind.LOCATION:
        setting.locations.set(id, new Location(id, source as LocationData));
        break;
      default:
        throw new Error(`Invalid entity kind: "${source.kind}"`);
    }
  }
}
