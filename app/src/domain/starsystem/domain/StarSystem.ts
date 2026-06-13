import { System } from './System';

export class StarSystem {
  public constructor(
    public readonly innerSystem: System,
    public readonly outerSystem?: System,
  ) {}
}
