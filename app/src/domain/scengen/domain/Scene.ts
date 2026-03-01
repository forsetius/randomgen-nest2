import { randomUUID } from 'node:crypto';
import { Lang } from '@shared/types/Lang';

export class Scene {
  public readonly id = randomUUID();

  public constructor(public readonly name: string) {}

  public serialize(lang: Lang) {
    console.log(lang);
    return {
      id: this.id,
      name: this.name,
    };
  }
}
