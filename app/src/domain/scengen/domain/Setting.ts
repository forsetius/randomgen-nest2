import * as Domain from '@domain/scengen/domain';
import { BadRequestException } from '@nestjs/common';
import { ObjectMap } from '@shared/util/collections/ObjectMap';

/**
 * Library of entities specific to a given setting.
 */
export class Setting {
  public readonly entities = ObjectMap.create<Domain.Entity>('id');
  public readonly factions = ObjectMap.create<Domain.Faction>('id');
  public readonly locations = ObjectMap.create<Domain.Location>('id');
  public readonly themes = ObjectMap.create<Domain.Theme>('id');
  public readonly goals = ObjectMap.create<Domain.Goal>('id');
  public readonly targets = ObjectMap.create<Domain.Target>('id');

  public constructor(public readonly name: string) {}

  /**
   * Get a faction by its ID.
   *
   * @throws {BadRequestException} if no such faction exists.
   */
  public getFaction(id: string): Domain.Faction {
    const faction = this.factions.get(id);
    if (!faction) throw new BadRequestException(`No such faction: "${id}"`);

    return faction;
  }

  /**
   * Get a location by its ID.
   *
   * @throws {BadRequestException} if no such location exists.
   */
  public getLocation(id: string): Domain.Location {
    const location = this.locations.get(id);
    if (!location) throw new BadRequestException(`No such location: "${id}"`);

    return location;
  }

  /**
   * Get a theme by its ID.
   *
   * @throws {BadRequestException} if no such theme exists.
   */
  public getTheme(id: string): Domain.Theme {
    const theme = this.themes.get(id);
    if (!theme) throw new BadRequestException(`No such theme: "${id}"`);

    return theme;
  }
}
