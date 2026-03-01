import path from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AppConfigService } from '@config/AppConfigService';
import { LoaderService } from '../../../base/parser/services/LoaderService';
import * as Domain from '@domain/scengen/domain';
import * as Model from '@domain/scengen/types/SettingModel';
import {
  SourceDataType,
  SourceDataZodSchema,
} from '@domain/scengen/validation/SourceDataZodSchema';
import { EntityId } from '@domain/scengen/types/aliases';
import { EntityKind } from '@domain/scengen/types/EntityKind';
import { RelationTag } from '@domain/scengen/types/RelationTag';
import { RelationEntry } from '@domain/scengen/types/SettingModel';
import { LEVEL_WEIGHT } from '@domain/scengen/types/Level';

@Injectable()
export class SettingService {
  private readonly settings = new Map<string, Domain.Setting>();

  public constructor(
    private readonly configService: AppConfigService,
    private readonly loaderService: LoaderService,
  ) {}

  async onModuleInit(): Promise<void> {
    const sourceDir = this.configService.get('scengen.sourceDir');
    const settingDirs = this.loaderService.getDirectoryList(sourceDir, false);

    for (const settingDir of settingDirs) {
      const dir = path.join(sourceDir, settingDir);
      const setting = await this.createFromDirectory(dir, SourceDataZodSchema);
      this.settings.set(setting.name, setting);
    }
  }

  /**
   * Get a setting by its name
   *
   * @throws {BadRequestException} if no such setting exists
   */
  public getSetting(name: string): Domain.Setting {
    const setting = this.settings.get(name);
    if (!setting) {
      throw new BadRequestException(`No such setting: "${name}"`);
    }

    return setting;
  }

  private async createFromDirectory(
    directory: string,
    zodSchema: typeof SourceDataZodSchema,
  ): Promise<Domain.Setting> {
    const settingName = path.basename(directory);
    const setting = new Domain.Setting(settingName);
    const entityParents = new Map<EntityId, EntityId | null>();
    const entityRelations = new Map<EntityId, EntityRelations>();

    for await (const loaded of this.loaderService.loadAndParse(
      directory,
      zodSchema,
    )) {
      const { id, parentId, relations } = loaded.data as SourceDataType;

      this.createEntity(setting, loaded.data as Model.EntityData);
      entityParents.set(id, parentId);
      entityRelations.set(id, relations);
    }
    this.hierarchize(setting, entityParents);
    this.interlink(setting, entityRelations);

    return setting;
  }

  /**
   * Create an entity from its data and add it to a setting.
   *
   * @throws {Error} if the entity with the same ID already exists.
   * @throws {Error} if the entity kind is invalid.
   */
  public createEntity(setting: Domain.Setting, source: Model.EntityData): void {
    if (setting.entities.has(source.id)) {
      throw new Error(`Entity with id "${source.id}" already exists.`);
    }

    const { id, kind } = source;
    switch (kind) {
      case EntityKind.FACTION: {
        const faction = new Domain.Faction(id, source as Model.FactionData);
        setting.factions.add(faction);
        setting.entities.add(faction);
        break;
      }
      case EntityKind.LOCATION: {
        const location = new Domain.Location(id, source as Model.LocationData);
        setting.locations.add(location);
        setting.entities.add(location);
        break;
      }
      case EntityKind.THEME: {
        const theme = new Domain.Theme(id, source as Model.ThemeData);
        setting.themes.add(theme);
        setting.entities.add(theme);
        break;
      }
      default:
        throw new Error(`Invalid entity kind: "${source.kind}"`);
    }
  }

  private hierarchize(
    setting: Domain.Setting,
    parents: Map<string, EntityId | null>,
  ): void {
    setting.entities.forEach((entity) => {
      const parentId = parents.get(entity.id);
      if (parentId === null) return;
      if (typeof parentId === 'undefined') {
        throw new Error(`No such relation data for entity: "${entity.id}"`);
      }
      if (parentId === entity.id) {
        throw new Error(`Entity "${entity.id}" has itself as parent`);
      }

      const parent = setting.entities.get(parentId);
      if (!parent) {
        throw new Error(`No such parent: "${parentId}" for "${entity.id}"`);
      }
      if (parent.kind !== entity.kind) {
        throw new Error(
          `${entity.kind} "${entity.id}" has a parent "${parentId}" that is a ${parent.kind}`,
        );
      }

      entity.parent = parent;
      parent.subItems.push(entity);
    });
  }

  private interlink(
    setting: Domain.Setting,
    entityRelations: Map<EntityId, EntityRelations>,
  ): void {
    setting.entities.forEach((entity) => {
      const relations = entityRelations.get(entity.id);
      if (relations === undefined) return;

      relations.forEach(([tag, relationEntry]) => {
        relationEntry.forEach(({ entityId, level }) => {
          const relatedEntity = setting.entities.get(entityId);
          if (!relatedEntity) {
            throw new Error(
              `No such entity: "${entityId}" for relation "${tag}" of "${entity.id}" entity`,
            );
          }

          entity.relations.add(tag, {
            entity: relatedEntity,
            weight: LEVEL_WEIGHT[level],
          });
        });
      });

      entityRelations.delete(entity.id);
    });
  }
}

type EntityRelations = [RelationTag, RelationEntry[]][];
