import * as fs from 'node:fs/promises';
import { join } from 'node:path';
import { minify } from 'html-minifier';
import { DateTime } from 'luxon';
import { PageProps } from '../types/PageMeta';
import { InvalidDateTimeException } from '@shared/exceptions/InvalidDateTimeException';
import { MarkdownService } from '../../parser/services/MarkdownService';
import { BlockFactory } from '../services';
import { TemplatingService } from '@templating/TemplatingService';
import { Library } from './Library';
import { Block } from './blocks/Block';
import type { PageDef } from '../types';
import { RenderedContent } from '../types/RenderedContent';
import type { SitewideData } from '../types/CmsModuleOptions';
import { Category } from './Category';
import { Locale } from './Locale';

export class Page {
  public category: Category | undefined = undefined;
  public readonly date: DateTime | undefined = undefined;
  public searchString = '';

  public constructor(
    private blockFactory: BlockFactory,
    private markdownService: MarkdownService,
    private templatingService: TemplatingService,
    private meta: SitewideData,
    public readonly slug: string,
    public readonly def: PageDef,
    private readonly locale: Locale,
  ) {
    if (def.searchable) {
      this.searchString = this.getSearchString();
    }

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
      content: this.markdownService.parse(this.def.content),
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
      dateTime: this.date,
      lang: this.locale.lang,
      langs: this.def.langs,
      translations: this.locale.translations,
      slug: this.slug,
      filename: this.filename,
    };
  }

  public async render(library: Library): Promise<RenderedContent[]> {
    const renderedContents: RenderedContent[] = [];
    const headerImage = await this.defaultImage(
      this.data.headerImage,
      this.meta.defaults.headerImage,
    );
    const thumbnailImage = await this.defaultImage(
      this.data.thumbnailImage,
      headerImage,
    );
    const data = {
      ...this.data,
      headerImage,
      thumbnailImage,
      appOrigin: this.meta.appOrigin,
      brand: this.meta.brand,
    };

    [
      { template: this.template, seoNaming: true },
      ...this.meta.fragmentTemplates.map((template) => ({
        template,
        seoNaming: false,
      })),
    ].forEach(({ template, seoNaming }) => {
      let content = this.templatingService.render(
        template,
        data as unknown as Record<string, unknown>,
      );

      content = this.insertMenus(content, library);
      content = this.fillSlots(content, library);
      content = this.insertBlocks(content, library);

      renderedContents.push({
        filepath: seoNaming ? this.filename : `${template}_${this.slug}.html`,
        content: this.minifyHTML(content),
      });
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
    const blockTagRegex =
      /<block (?<attrs>[^>]*?)(?:\/>|>(?<content>.*?)<\/block>)/gs;
    const attrRegex = /(\w+)="([^"]*)"/g;

    for (const res of content.matchAll(blockTagRegex)) {
      const [blockTag, attrs] = res;
      if (typeof attrs === 'undefined') {
        continue;
      }

      let args = Object.fromEntries(
        Array.from(attrs.matchAll(attrRegex)).map(([, attr, val]) => {
          return [attr, val] as [string, unknown];
        }),
      );
      if (!('content' in args) && res.groups?.['content']) {
        args['content'] = res.groups['content'];
      }

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
      console.error('❌ Error while minifying the HTML:\n', err);

      return content;
    }
  }

  private getSearchString(includeContent = false): string {
    return [
      this.def.title,
      this.def.subtitle,
      this.def.tags.join(' ').replaceAll('-', ' '),
      this.def.excerpt && this.markdownService.stripMarkdown(this.def.excerpt),
      this.def.lead && this.markdownService.stripMarkdown(this.def.lead),
      includeContent && this.markdownService.stripMarkdown(this.def.content),
    ]
      .filter((str) => typeof str === 'string')
      .join(' ')
      .toLowerCase();
  }

  private async defaultImage(
    image: string,
    defaultTo: string,
  ): Promise<string> {
    try {
      await fs.access(join(this.meta.paths.mediaDir, image), fs.constants.R_OK);

      return image;
    } catch {
      return defaultTo;
    }
  }
}
