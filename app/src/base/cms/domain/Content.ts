import { Block, BlockPlacement, PageDef, PostDef } from '../types';
import { marked } from 'marked';

export class Content {
  public readonly title: string;
  public readonly headerImage: string;
  public readonly thumbnailImage: string;
  public readonly lead: string | undefined;
  public readonly content: string;
  public readonly blocks: Record<BlockPlacement, Block[]> = {
    [BlockPlacement.RIGHT]: [],
    [BlockPlacement.TOP_RIGHT]: [],
    [BlockPlacement.UNDER_TITLE]: [],
    [BlockPlacement.UNDER_LEAD]: [],
    [BlockPlacement.BELOW]: [],
  };

  public constructor(
    public readonly slug: string,
    def: PageDef | PostDef,
  ) {
    this.title = def.title;
    this.headerImage = def.headerImage;
    this.thumbnailImage = def.thumbnailImage ?? def.headerImage;
    this.lead = def.lead ? (marked.parse(def.lead) as string) : undefined;
    this.content = marked.parse(def.content) as string;
  }
}
