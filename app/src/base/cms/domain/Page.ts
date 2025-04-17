import { MarkdownService } from '../../parser/services/MarkdownService';
import { Locale } from '@shared/types/Locale';
import { TemplatingService } from '@templating/TemplatingService';
import { PageDef } from '../types';
import { Block } from './Block';
import { BlockFactory } from '../services/BlockFactory';
import { DynamicBlock } from './DynamicBlock';
import { DateTime } from 'luxon';
import { PageLib } from './PageLib';
import { Menu } from './Menu';

export class Page {
  private _content?: string;
  public readonly dynamicBlocks = new Map<string, DynamicBlock>();
  public readonly slug: string;
  public readonly searchString: string;
  public readonly date: DateTime | undefined;
  public readonly timestamp: number | undefined;

  public constructor(
    private blockFactory: BlockFactory,
    private markdownService: MarkdownService,
    private templatingService: TemplatingService,
    public filename: string,
    public readonly def: PageDef,
    public readonly locale: Locale,
  ) {
    const filenameParts:
      | { date?: string; time?: string; slug?: string }
      | undefined = new RegExp(
      /^(?:(?<date>\d{4}-\d{2}-\d{2})(?:_(?<time>\d{2}-\d{2}-\d{2})?)?_)?(?<slug>.+)$/m,
    ).exec(filename)?.groups;

    if (!filenameParts?.slug) {
      throw new Error(`Invalid filename: ${filename}. No slug found.`);
    }
    this.slug = filenameParts.slug;
    this.searchString = this.getSearchString();

    if (filenameParts.date) {
      const dateString = filenameParts.time
        ? `${filenameParts.date} ${filenameParts.time.replaceAll('-', ':')}`
        : `${filenameParts.date} 00:00:00`;

      let date: DateTime;
      try {
        date = DateTime.fromSQL(dateString);
      } catch (e: unknown) {
        if (e instanceof Error) {
          throw new Error(
            `Invalid date: ${dateString} in filename: ${filename}. \nReason: ${e.message}`,
          );
        }

        throw new Error(`Invalid date: ${dateString}`);
      }

      this.date = date;
      this.timestamp = date.toSeconds();
    }
  }

  get template(): string {
    return this.def.template;
  }

  get content(): string {
    if (typeof this._content === 'undefined') {
      throw new Error(`Page ${this.slug} is not prerendered yet`);
    }

    return this._content;
  }

  public parseMarkdown(): PageDef {
    return {
      ...this.def,
      title: this.markdownService.parse(this.def.title),
      subtitle: this.def.subtitle
        ? this.markdownService.parse(this.def.subtitle)
        : undefined,
      excerpt: this.def.excerpt
        ? this.markdownService.parse(this.def.excerpt)
        : undefined,
      lead: this.def.lead
        ? this.markdownService.parse(this.def.lead)
        : undefined,
      content: this.markdownService.parse(this.def.content),
    };
  }

  public preRender(
    menus: Map<string, Menu>,
    blocks: Map<string, Block>,
    pages: PageLib,
  ): void {
    const def: PageDef = this.parseMarkdown();
    this._content = this.templatingService.render(
      this.template,
      {
        ...def,
        meta: { lang: this.locale },
        brand: { name: 'Forseti: abstract works' },
      },
      this.locale,
    );

    const menuMatches = this._content.matchAll(
      /<menu id="(?<id>[a-zA-Z0-9]+)" \/>/gm,
    );
    for (const [match, id] of menuMatches) {
      if (typeof id === 'undefined') {
        throw new Error(`Menu without id in ${this.template}`);
      }
      if (!menus.has(id)) {
        throw new Error(`Unknown menu "${id}" in ${this.template}`);
      }

      this._content = this._content.replace(match, menus.get(id)!.content);
    }

    const blockMatches = this._content.matchAll(
      /<block id="(?<id>[a-zA-Z0-9]+)"><\/block>/gm,
    );
    for (const [match, id] of blockMatches) {
      if (typeof id === 'undefined') {
        throw new Error(`Block without id in ${this.slug}`);
      }

      let block: Block;
      if (blocks.has(id)) {
        block = blocks.get(id)!;
      } else {
        if (!this.def.blocks || !(id in this.def.blocks)) {
          throw new Error(`Block with id ${id} not found in page ${this.slug}`);
        }

        block = this.blockFactory.create(id, this.def.blocks[id]!, this.locale);
        block.preRender(pages);
      }

      this._content = this._content.replace(match, block.content);
      if (block instanceof DynamicBlock) {
        this.dynamicBlocks.set(id, block);
      }
    }
  }

  private getSearchString(includeContent = false): string {
    return [
      this.markdownService.stripMarkdown(this.def.title),
      this.def.subtitle &&
        this.markdownService.stripMarkdown(this.def.subtitle),
      this.def.excerpt && this.markdownService.stripMarkdown(this.def.excerpt),
      this.def.lead && this.markdownService.stripMarkdown(this.def.lead),
      includeContent && this.markdownService.stripMarkdown(this.def.content),
    ]
      .filter((str) => typeof str === 'string')
      .join(' ')
      .toLowerCase();
  }
}
