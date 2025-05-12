import { MarkdownService } from '../../parser/services/MarkdownService';
import { TemplatingService } from '@templating/TemplatingService';
import { PageDef } from '../types';
import { Block } from './blocks/Block';
import { BlockFactory } from '../services/BlockFactory';
import { DynamicBlock } from './blocks/DynamicBlock';
import { DateTime } from 'luxon';
import { PageLib } from './PageLib';
import { Menu } from './Menu';
import { FullPageDef, PageMeta } from '../types/PageMeta';
import { Logger } from '@nestjs/common';

export class Page {
  private _content?: string;
  public readonly dynamicBlocks = new Map<string, DynamicBlock>();
  public readonly searchString: string;
  public readonly series: string | undefined;
  public readonly date: DateTime | undefined;
  public readonly timestamp: number | undefined;
  public readonly def: FullPageDef;
  private readonly logger = new Logger(Page.name);

  public constructor(
    private blockFactory: BlockFactory,
    private markdownService: MarkdownService,
    private templatingService: TemplatingService,
    public filename: string,
    def: PageDef & PageMeta,
  ) {
    const filenameParts:
      | { series?: string; date?: string; time?: string; slug?: string }
      | undefined = new RegExp(
      /^(?<slug>(?:(?<series>[a-z][a-z0-9-]*)_(?<date>\d{4}-\d{2}-\d{2})(?:_(?<time>\d{2}-\d{2}-\d{2})?)?_)?.+)$/m,
    ).exec(filename)?.groups;

    if (!filenameParts?.slug) {
      throw new Error(`Invalid filename: ${filename}. No slug found.`);
    }
    this.def = {
      ...def,
      slug: filenameParts.slug,
    };
    this.searchString = this.getSearchString();

    if (filenameParts.date) {
      this.series = filenameParts.series;
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

      if (date.isValid) {
        this.def.date = date.toLocaleString(DateTime.DATE_MED);
      }
      this.date = date;
      this.timestamp = date.toSeconds();
    }

    this.logger.log(`${this.def.slug} created`);
  }

  get template(): string {
    return this.def.template;
  }

  get content(): string {
    if (typeof this._content === 'undefined') {
      throw new Error(`Page ${this.def.slug} is not pre-rendered yet`);
    }

    return this._content;
  }

  public parseMarkdown(): FullPageDef {
    return {
      ...this.def,
      title: this.def.title,
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
    const def = this.parseMarkdown();
    this._content = this.templatingService.render(
      this.template,
      def as unknown as Record<string, unknown>,
      this.def.locale,
    );

    this.insertMenus(menus);
    this.fillSlots(pages);
    this.insertBlocks(blocks, pages);
  }

  private insertMenus(menus: Map<string, Menu>) {
    const menuMatches = (this._content ?? '').matchAll(
      /<menu id="(?<id>[a-zA-Z0-9]+)" \/>/gm,
    );

    for (const [match, id] of menuMatches) {
      if (typeof id === 'undefined') {
        throw new Error(`Menu without id in ${this.template}`);
      }
      if (!menus.has(id)) {
        throw new Error(`Unknown menu "${id}" in ${this.template}`);
      }
      this._content = (this._content ?? '').replace(
        match,
        menus.get(id)!.content,
      );
    }
  }

  private fillSlots(pages: PageLib) {
    const slotTagRegex = /<slot id="(?<id>[a-zA-Z0-9-_]+)" ?\/>/g;
    if (!this._content) {
      return;
    }

    for (const [slotTag, id] of this._content.matchAll(slotTagRegex)) {
      if (typeof id === 'undefined') {
        throw new Error(`Slot without id in ${this.template}`);
      }

      if (this.def.slots && id in this.def.slots) {
        const blockDefs = this.def.slots[id]!;
        const slotContent = blockDefs.map((blockDef, i) => {
          const blockId = `slot-${id}_block-${i.toString()}`;
          const block = this.blockFactory.create(
            blockId,
            blockDef,
            this.def.locale,
            this.def.slug,
          );

          block.preRender(pages);
          if (block instanceof DynamicBlock) {
            this.dynamicBlocks.set(id, block);

            return `<dynamic-block id="${blockId}" />`;
          }

          return block.content;
        });

        this._content = this._content.replace(slotTag, slotContent.join('\n'));
      }
    }
  }

  private insertBlocks(sharedBlocks: Map<string, Block>, pages: PageLib) {
    if (!this._content) {
      return;
    }

    const blockTagRegex = /<block ([^>]*?)\/?>/g;
    const attrRegex = /(\w+)="([^"]*)"/g;

    for (const [blockTag, attrs] of this._content.matchAll(blockTagRegex)) {
      if (typeof attrs === 'undefined') {
        continue;
      }

      let args = Object.fromEntries(
        Array.from(attrs.matchAll(attrRegex)).map(([, attr, val]) => {
          return [attr, val] as [string, unknown];
        }),
      );

      const id = args['id'];
      if (typeof id !== 'string') {
        throw new Error(`Block with no id found in page ${this.def.slug}`);
      }

      if (this.def.blocks && id in this.def.blocks) {
        args = { ...args, ...this.def.blocks[id] };
      }

      let block: Block;
      if (sharedBlocks.has(id)) {
        block = sharedBlocks.get(id)!;
      } else {
        const blockArgs = this.blockFactory.validate(`Block "${id}"`, args);
        block = this.blockFactory.create(
          id,
          blockArgs,
          this.def.locale,
          this.def.slug,
        );
      }

      block.preRender(pages);
      this._content = this._content.replace(blockTag, block.content);
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

  public async render(): Promise<string> {
    if (this.dynamicBlocks.size === 0) {
      return this.content;
    }

    let content = this.content;
    const renderedBlocks = await Promise.all(
      Array.from(this.dynamicBlocks.entries()).map(
        async ([id, block]): Promise<[string, string]> => [
          id,
          await block.render(),
        ],
      ),
    );
    renderedBlocks.forEach(([id, renderedBlock]) => {
      content = content.replace(`<dynamic-block id="${id}" />`, renderedBlock);
    });

    return content;
  }
}
