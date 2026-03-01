import { EdgeType } from '@domain/scengen/types/EdgeType';
import { Scene } from '@domain/scengen/domain/Scene';

export class SceneEdge {
  public readonly id: string;
  public description: string;

  public constructor(
    public readonly from: Scene,
    public readonly to: Scene,
    public readonly type: EdgeType = EdgeType.NORMAL,
    description?: string,
  ) {
    if (from === to) {
      throw new Error('from and to cannot be the same');
    }
    this.id = `${from.id}->${to.id}`;
    this.description = description ?? `${type.toUpperCase()}: ${this.id}`;
  }
}
