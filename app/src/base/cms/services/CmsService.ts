import fs from 'node:fs';
import fsAsync from 'node:fs/promises';
import { join } from 'node:path';
import { Inject, Injectable } from '@nestjs/common';
import { Lang } from '@shared/types/Lang';
import stopwatch from '@shared/util/stopwatch';
import { Library } from '../domain/Library';
import { Locale } from '../domain/Locale';
import { RenderedContent } from '../types/RenderedContent';
import { TemplatingService } from '@templating/TemplatingService';
import type { SitewideData } from '../types/CmsModuleOptions';
import { CMS_OPTIONS } from '../CmsConstants';
import { LibraryFactory } from './LibraryFactory';
import { cwd } from 'node:process';

@Injectable()
export class CmsService {
  private readonly baseOutputPath: string;
  private libraries!: Record<Lang, Library>;

  public constructor(
    private readonly templatingService: TemplatingService,
    private readonly libraryFactory: LibraryFactory,
    @Inject(CMS_OPTIONS) private readonly metadata: SitewideData,
  ) {
    this.baseOutputPath = join(cwd(), 'content', 'cms', 'static');
  }

  async onModuleInit(): Promise<void> {
    await this.renderAll();
  }

  public async renderAll(): Promise<void> {
    stopwatch.record('Loading CMS data...');
    this.libraries = Object.fromEntries(
      await Promise.all(
        Object.values(Lang).map(
          async (lang): Promise<[Lang, Library]> => [
            lang,
            await this.libraryFactory.create(new Locale(lang)),
          ],
        ),
      ),
    ) as Record<Lang, Library>;

    for (const library of Object.values(this.libraries)) {
      await this.render(library);
    }
    stopwatch.record('HTML files generated');
  }

  public async render(library: Library): Promise<void> {
    const renderedContents = (
      await Promise.all(
        Array.from(library.pages).map(
          async ([, page]) => await page.render(library),
        ),
      )
    ).flat();
    renderedContents.push({
      filepath: 'rss.xml',
      content: this.constructRss(library),
    });

    await this.saveContent(
      renderedContents.map(({ filepath, content }) => ({
        filepath,
        content: this.linkify(content),
      })),
      library.locale.lang,
    );
    stopwatch.record(`Rendered library "${library.locale.lang}"`);
  }

  private linkify(content: string): string {
    return content.replace(
      /@\{(?<lang>pl|en)\/(?<slug>[\p{L}\d_-]+?)(?<anchor>#[\p{L}\d_-]+?)?\}/gu,
      (_match, lang: Lang, slug: string, anchor: string) => {
        const page = this.libraries[lang].getPage(slug);
        const title = page.def.excerpt ? `" title="${page.def.excerpt}` : '';

        return `/pages/${lang}/${page.filename}${anchor}${title}`;
      },
    );
  }

  private async saveContent(
    renderedContents: RenderedContent[],
    lang: Lang,
  ): Promise<void> {
    const pagesDir = join(this.baseOutputPath, 'pages', lang);
    const pagesTempDir = await fsAsync.mkdtemp(`${pagesDir}-`);

    try {
      await Promise.all(
        renderedContents.map(({ filepath, content }) => {
          return fsAsync.writeFile(join(pagesTempDir, filepath), content);
        }),
      );
    } catch (error) {
      await fsAsync.rm(pagesTempDir, { recursive: true, force: true });
      throw error;
    }

    let oldPagesDir: string | null = null;
    if (fs.existsSync(pagesDir)) {
      oldPagesDir = fs.realpathSync(pagesDir);
      fs.unlinkSync(pagesDir);
    }
    fs.symlinkSync(pagesTempDir, pagesDir);
    if (oldPagesDir) {
      await fsAsync.rm(oldPagesDir, { recursive: true, force: true });
    }
  }

  private constructRss(library: Library): string {
    const blogPages =
      library.categories
        .get('blog')
        ?.getPages()
        .map((page) => page.data) ?? [];

    return this.templatingService.render('rss-feed', {
      pages: blogPages,
      metadata: this.metadata,
      lang: library.locale.lang,
      translations: library.locale.translations,
    });
  }

  public search(
    term: string,
    lang: Lang,
    template: string,
    limit?: number,
  ): string {
    const pages = this.libraries[lang].search(term, limit);

    return JSON.stringify(pages.map((page) => `${template}_${page.slug}.html`));
  }

  public getTag(tag: string, lang: Lang, template: string): string {
    const pages = this.libraries[lang].tags.get(tag) ?? [];

    return JSON.stringify(pages.map((page) => `${template}_${page.slug}.html`));
  }

  public getTags(lang: Lang, template: string): string {
    const tags = Array.from(this.libraries[lang].tags.keys());

    return JSON.stringify(tags.map((tag) => `${template}_tag.html?tag=${tag}`));
  }
}
