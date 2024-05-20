import { BlockStyle, BlockType, NoteBlockDef } from '../types';

export class NoteBlock {
  public readonly type = BlockType.NOTE;
  public readonly style: BlockStyle;
  public readonly title: string;
  public readonly content: string;

  public constructor(def: NoteBlockDef) {
    this.style = def.style;
    this.title = def.title;
    this.content = def.content;
  }
}
