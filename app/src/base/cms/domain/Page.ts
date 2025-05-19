import { DateTime } from 'luxon';
import { PageProps } from '../types/PageMeta';
import { Logger } from '@nestjs/common';
import { InvalidDateTimeException } from '@shared/exceptions/InvalidDateTimeException';
import { MarkdownService } from '../../parser/services/MarkdownService';
import { BlockFactory } from '../services/BlockFactory';
import { TemplatingService } from '@templating/TemplatingService';
import { Library } from './Library';
import { Block } from './blocks/Block';
import { PageDef } from '../types';
import { RenderedContent } from '../types/RenderedContent';
import { CmsServiceOptions } from '../types/CmsModuleOptions';
import { Locale } from '@shared/types/Locale';

export class Page {
  public readonly slug: string;
  public readonly series: string | undefined = undefined;
  public readonly date: DateTime | undefined = undefined;
  public readonly sort: number | undefined = undefined;
  public readonly searchString: string;
  private readonly logger = new Logger(Page.name);

  public constructor(
    private blockFactory: BlockFactory,
    private markdownService: MarkdownService,
    private templatingService: TemplatingService,
    filename: string,
    public readonly def: PageDef,
    private readonly lang: Locale,
  ) {
    const filenameParts:
      | {
          series?: string;
          date?: string;
          time?: string;
          sort?: string;
          slug?: string;
        }
      | undefined = new RegExp(
      /^(?<slug>(?:(?<series>[a-z][a-z0-9-]*)_(?:(?<sort>[1-9]\d*)|(?<date>\d{4}-\d{2}-\d{2})(?:_(?<time>\d{2}-\d{2}-\d{2})?)?)_)?.+)$/m,
    ).exec(filename)?.groups;

    if (!filenameParts?.slug) {
      throw new Error(`Invalid filename: ${filename}`);
    }
    this.slug = filenameParts.slug;
    this.searchString = this.getSearchString();

    if (filenameParts.sort) {
      this.sort = parseInt(filenameParts.sort, 10);
    }

    if (filenameParts.date) {
      this.series = filenameParts.series;
      const dateString = filenameParts.time
        ? `${filenameParts.date} ${filenameParts.time.replaceAll('-', ':')}`
        : `${filenameParts.date} 00:00:00`;

      try {
        this.date = DateTime.fromSQL(dateString);
        if (!this.sort) {
          this.sort = this.date.toSeconds();
        }
      } catch (e: unknown) {
        throw new InvalidDateTimeException(
          `Invalid date: ${dateString} in ${filename}`,
          e,
        );
      }
    }

    this.logger.log(`${this.slug} created`);
  }

  get template(): string {
    return this.def.template;
  }

  get timestamp(): number | undefined {
    return this.date?.toSeconds();
  }

  get data(): PageDef & PageProps {
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
      slug: this.slug,
      series: this.series,
      date: this.date?.toLocaleString(DateTime.DATE_MED),
      sort: this.sort,
      lang: this.lang,
      htmlFilename: `/pages/${this.lang}/${this.slug}.html`,
    };
  }

  public render(library: Library, opts: CmsServiceOptions): RenderedContent[] {
    const renderedContents: RenderedContent[] = [];
    const data = {
      ...this.data,
      meta: opts.meta,
      brand: opts.brand,
    };

    opts.fragmentTemplates.forEach((template) => {
      renderedContents.push({
        filepath: `${template}_${this.slug}`,
        content: this.templatingService.render(
          template,
          data as unknown as Record<string, unknown>,
        ),
      });
    });

    let pageContent = this.templatingService.render(
      this.template,
      data as unknown as Record<string, unknown>,
    );

    pageContent = this.insertMenus(pageContent, library);
    pageContent = this.fillSlots(pageContent, library);
    pageContent = this.insertBlocks(pageContent, library);
    renderedContents.push({
      filepath: this.slug,
      content: pageContent,
    });

    return renderedContents;
  }

  private insertMenus(content: string, library: Library): string {
    const menuMatches = content.matchAll(
      /<menu id="(?<id>[a-zA-Z0-9]+)" \/>/gm,
    );

    for (const [match, id] of menuMatches) {
      if (typeof id === 'undefined') {
        throw new Error(`Menu without id in ${this.template}`);
      }
      if (!library.menus.has(id)) {
        throw new Error(`Unknown menu "${id}" in ${this.template}`);
      }
      content = content.replace(match, library.menus.get(id)!.content);
    }

    return content;
  }

  private fillSlots(content: string, library: Library): string {
    const slotTagRegex = /<slot id="(?<id>[a-zA-Z0-9-_]+)" ?\/>/g;

    for (const [slotTag, id] of content.matchAll(slotTagRegex)) {
      if (typeof id === 'undefined') {
        throw new Error(`Slot without id in ${this.template}`);
      }

      if (this.def.slots && id in this.def.slots) {
        const blockDefs = this.def.slots[id]!;
        const slotContent = blockDefs.map((blockDef, i) => {
          const blockId = `slot-${id}_block-${i.toString()}`;
          const block = this.blockFactory.create(blockId, blockDef, this.slug);

          block.render(library);

          return block.content;
        });

        content = content.replace(slotTag, slotContent.join('\n'));
      }
    }

    return content;
  }

  private insertBlocks(content: string, library: Library): string {
    const blockTagRegex = /<block ([^>]*?)\/?>/g;
    const attrRegex = /(\w+)="([^"]*)"/g;

    for (const [blockTag, attrs] of content.matchAll(blockTagRegex)) {
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
        throw new Error(`Block with no id found in page ${this.slug}`);
      }

      if (this.def.blocks && id in this.def.blocks) {
        args = { ...args, ...this.def.blocks[id] };
      }

      let block: Block;
      if (library.blocks.has(id)) {
        block = library.blocks.get(id)!;
      } else {
        const blockArgs = this.blockFactory.validate(`Block "${id}"`, args);
        block = this.blockFactory.create(id, blockArgs, this.slug);
      }

      block.render(library);
      content = content.replace(blockTag, block.content);
    }

    return content;
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
