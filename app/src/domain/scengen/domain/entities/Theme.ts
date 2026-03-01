import { Entity } from '@domain/scengen/domain/entities/Entity';
import { ThemeData } from '@domain/scengen/types/SettingModel';

export class Theme extends Entity {
  public override parent: Theme | null = null;
  public override readonly subItems: Theme[] = [];

  public constructor(id: string, data: ThemeData) {
    super(id, data);
  }
}
