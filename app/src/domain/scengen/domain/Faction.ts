import { Level } from '@domain/scengen/types/Level';
import { Location } from './Location';
import { FactionData } from '@domain/scengen/types/SettingModel';
import { Entity } from '@domain/scengen/domain/Entity';
import { Relations, RelationTag } from '@domain/scengen/types/RelationTag';
import { Setting } from '@domain/scengen/domain/Setting';
import { throwOnUndefined } from '@shared/util/isType';
import { RelationModel } from '@domain/scengen/types/RelationModel';
import { EntityRelation } from '@domain/scengen/types/EntityRelation';
import { BadRequestException } from '@nestjs/common';

export class Faction extends Entity {
  public readonly factions = new Map<EntityId, EntityRelation<Faction>>();
  public readonly locations = new Map<EntityId, EntityRelation<Location>>();
  public readonly securityLevel: Level;
  public parent: Faction | null = null;
  public readonly subItems: Faction[] = [];

  private toHydrate: {
    parent: EntityId | null;
    relations: Partial<Record<RelationTag, Record<string, number>>>;
  } | null;

  constructor(id: string, data: FactionData) {
    super(id, data);

    this.securityLevel = data.securityLevel;
    this.toHydrate = {
      parent: data.parentId,
      relations: data.relations ?? {},
    };
  }

  public hydrate(setting: Setting): void {
    if (this.toHydrate === null) return;

    const { parent, relations } = this.toHydrate;
    if (parent !== null) {
      this.parent = throwOnUndefined(
        setting.factions.get(parent),
        new BadRequestException(
          `No such parent "${parent}" for "${this.id}" faction`,
        ),
      );

      this.parent.subItems.push(this);
    }

    for (const [relationTag, weightedEntities] of Object.entries(relations)) {
      const tag = relationTag as RelationTag;

      for (const [entityTypeId, weight] of Object.entries(weightedEntities)) {
        const [entityType, entityId] = this.getEntityRef(entityTypeId, tag);
        switch (entityType) {
          case 'faction':
            this.addFaction(setting, { entityId, tag, weight });
            break;

          case 'location':
            this.addLocation(setting, { entityId, tag, weight });
            break;

          default:
            throw new Error(
              `Invalid relation "${tag}": "${entityTypeId}" for "${this.id}" faction.`,
            );
        }
      }
    }

    this.toHydrate = null;
  }

  private addFaction(setting: Setting, relations: RelationModel): void {
    const { entityId, tag, weight } = relations;
    const entity = throwOnUndefined(
      setting.factions.get(entityId),
      new BadRequestException(
        `No such faction: "${entityId}" in "${this.id}" faction`,
      ),
    );

    this.factions.set(entityId, { entity, relation: tag, weight });
    if (Relations[tag]) {
      entity.factions.set(this.id, {
        entity: this,
        relation: Relations[tag],
        weight,
      });
    }
  }

  private addLocation(setting: Setting, relations: RelationModel): void {
    const { entityId, tag, weight } = relations;
    const entity = throwOnUndefined(
      setting.locations.get(entityId),
      new BadRequestException(
        `No such location: "${entityId}" in "${this.id}" faction`,
      ),
    );

    this.locations.set(entityId, { entity, relation: tag, weight });
    if (Relations[tag]) {
      entity.factions.set(this.id, {
        entity: this,
        relation: Relations[tag],
        weight,
      });
    }
  }
}

type EntityId = string;
