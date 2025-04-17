import { Block } from './Block';

export abstract class DynamicBlock extends Block {
  public abstract render(): Promise<void>;
}
