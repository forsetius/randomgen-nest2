import { BlockStyle } from './BlockStyle';
import { BlockType } from './BlockType';

interface CommonBlockDef {
  name: string;
  template: string;
  style: BlockStyle;
}

export interface ApiCallBlockDef extends CommonBlockDef {
  type: BlockType.API_CALL;
  url: string;
}

export interface PageBlockDef extends CommonBlockDef {
  type: BlockType.PAGE;
  slug: string;
}

export interface PageListBlockDef extends CommonBlockDef {
  type: BlockType.PAGE_LIST;
  count: number;
  skip: number;
  tag?: string;
}

export interface PageSetBlockDef extends CommonBlockDef {
  type: BlockType.PAGE_SET;
  title: string;
  items: string[];
}

export type BlockDef =
  | ApiCallBlockDef
  | PageBlockDef
  | PageListBlockDef
  | PageSetBlockDef;
