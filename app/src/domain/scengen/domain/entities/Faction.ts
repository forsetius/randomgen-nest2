import { Level } from '@domain/scengen/types/Level';
import { FactionData } from '@domain/scengen/types/SettingModel';
import { Entity } from '@domain/scengen/domain/entities/Entity';

export class Faction extends Entity {
  public readonly securityLevel: Level;
  public override parent: Faction | null = null;
  public override readonly subItems: Faction[] = [];

  constructor(id: string, data: FactionData) {
    super(id, data);

    this.securityLevel = data.securityLevel;
  }
}
