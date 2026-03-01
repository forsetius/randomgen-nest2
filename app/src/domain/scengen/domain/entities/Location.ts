import { Level } from '@domain/scengen/types/Level';
import { LocationData } from '@domain/scengen/types/SettingModel';
import { Entity } from '@domain/scengen/domain/entities/Entity';
import { EntityRelation } from '@domain/scengen/types/EntityRelation';
import { Faction } from '@domain/scengen/domain/entities/Faction';
import { Theme } from '@domain/scengen/domain/entities/Theme';

export class Location extends Entity {
  public readonly factions = new Map<string, EntityRelation<Faction>>();
  public readonly locations = new Map<string, EntityRelation<Location>>();
  public readonly themes = new Map<string, EntityRelation<Theme>>();
  public readonly securityLevel: Level;
  public override parent: Location | null = null;
  public override readonly subItems: Location[] = [];

  public constructor(id: string, data: LocationData) {
    super(id, data);

    this.securityLevel = data.securityLevel;
  }
}
