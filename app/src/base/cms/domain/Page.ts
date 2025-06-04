import { DateTime } from 'luxon';
import { minify } from 'html-minifier';
import { PageProps } from '../types/PageMeta';
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
import { Category } from './Category';

export class Page {
  public category: Category | undefined = undefined;
  public readonly date: DateTime | undefined = undefined;
  public searchString: string;

  public constructor(
    private blockFactory: BlockFactory,
    private markdownService: MarkdownService,
    private templatingService: TemplatingService,
    public readonly slug: string,
    public readonly def: PageDef,
    private readonly lang: Locale,
  ) {
    this.searchString = this.getSearchString();

    if (def.date) {
      try {
        this.date = DateTime.fromSQL(def.date);
      } catch (e: unknown) {
        throw new InvalidDateTimeException(
          `Invalid date: ${def.date} in ${this.slug}`,
          e,
        );
      }
    }
  }

  get template(): string {
    return this.def.template;
  }

  get filename(): string {
    return `${[this.category?.fullSlug, this.slug].filter(Boolean).join('_')}.html`;
  }

  get data(): PageDef & PageProps {
    const categoryPages = this.category?.getPages();
    let currentPageIndex = categoryPages?.findIndex(
      (page) => page.slug === this.slug,
    );
    if (currentPageIndex === -1) {
      currentPageIndex = undefined;
    }

    return {
      ...this.def,
      title: this.def.title,
      subtitle: this.def.subtitle,
      excerpt: this.def.excerpt
        ? this.markdownService.parse(this.def.excerpt)
        : undefined,
      lead: this.def.lead
        ? this.markdownService.parse(this.def.lead)
        : undefined,
      content: this.def.content,
      categoryData: this.category
        ? {
            current: this.category,
            prev:
              typeof currentPageIndex === 'number' && currentPageIndex > 0
                ? categoryPages![currentPageIndex - 1]!
                : undefined,
            next:
              typeof currentPageIndex === 'number' &&
              categoryPages!.length > currentPageIndex
                ? categoryPages![currentPageIndex + 1]!
                : undefined,
          }
        : undefined,
      date: this.date?.setLocale(this.lang).toLocaleString(DateTime.DATE_FULL),
      lang: this.lang,
      slug: this.slug,
      filename: this.filename,
    };
  }

  public render(library: Library, opts: CmsServiceOptions): RenderedContent[] {
    const renderedContents: RenderedContent[] = [];
    const data = {
      ...this.data,
      meta: opts.meta,
      brand: opts.brand,
    };

    if (typeof this.category !== 'undefined') {
      opts.fragmentTemplates.forEach((template) => {
        renderedContents.push({
          filepath: `${template}_${this.slug}.html`,
          content: this.templatingService.render(
            template,
            data as unknown as Record<string, unknown>,
          ),
        });
      });
    }

    let pageContent = this.templatingService.render(
      this.template,
      data as unknown as Record<string, unknown>,
    );

    pageContent = this.insertMenus(pageContent, library);
    pageContent = this.fillSlots(pageContent, library);
    pageContent = this.insertBlocks(pageContent, library);
    pageContent = this.resolveSlugs(pageContent, library);
    pageContent = this.minifyHTML(pageContent);
    renderedContents.push({
      filepath: this.filename,
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
          const block = this.blockFactory.create(blockId, blockDef);

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
        block = this.blockFactory.create(id, blockArgs);
      }

      block.render(library);
      content = content.replace(blockTag, block.content);
    }

    return content;
  }

  private resolveSlugs(content: string, library: Library): string {
    return content.replace(
      /@{(?<slug>[a-z0-9_-]+?)}/g,
      (_match, slug: string) => library.getPage(slug).filename,
    );
  }

  private minifyHTML(content: string): string {
    try {
      return minify(content, {
        caseSensitive: true,
        collapseWhitespace: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
      });
    } catch (err) {
      console.error('❌ Error while minifying the HTML:', err);

      return content;
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
