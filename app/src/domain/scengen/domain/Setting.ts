import { Faction } from '@domain/scengen/domain/Faction';
import { Location } from '@domain/scengen/domain/Location';
import { EntityId } from '@domain/scengen/types/aliases';

/**
 * Library of entities specific to a given setting.
 */
export class Setting {
  public readonly factions = new Map<EntityId, Faction>();
  public readonly locations = new Map<EntityId, Location>();

  public constructor(public readonly name: string) {}

  public interlink(): void {
    this.factions.forEach((faction) => {
      faction.hydrate(this);
    });

    this.locations.forEach((location) => {
      location.hydrate(this);
    });
  }
}
