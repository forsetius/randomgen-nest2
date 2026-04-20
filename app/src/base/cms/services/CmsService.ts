import fs from 'node:fs';
import fsAsync from 'node:fs/promises';
import { join } from 'node:path';
import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Lang, type Lang as AppLang } from '@shared/types/Lang';
import stopwatch from '@shared/util/stopwatch';
import { Library } from '../domain/Library';
import { Locale } from '../domain/Locale';
import { RenderedContent } from '../types/RenderedContent';
import { TemplatingService } from '@templating/TemplatingService';
import type { SitewideData } from '../types/CmsModuleOptions';
import { LibraryFactory } from './LibraryFactory';
import { CmsModuleConfigContract } from '@config/AppConfigContracts';

@Injectable()
export class CmsService {
  private readonly sourceDir: string;
  private readonly outputDir: string;
  private libraries!: Record<AppLang, Library>;
  private readonly metadata: SitewideData;

  public constructor(
    private readonly templatingService: TemplatingService,
    private readonly libraryFactory: LibraryFactory,
    @Inject(CmsModuleConfigContract.token)
    config: SitewideData,
  ) {
    this.metadata = config;
    this.sourceDir = config.paths.sourceDir;
    this.outputDir = config.paths.outputDir;
  }

  async onModuleInit(): Promise<void> {
    await this.renderAll();
  }

  public async renderAll(): Promise<void> {
    stopwatch.record('Loading CMS data...');
    this.libraries = Object.fromEntries(
      await Promise.all(
        Object.values(Lang).map(
          async (lang): Promise<[AppLang, Library]> => [
            lang,
            await this.libraryFactory.create(new Locale(this.sourceDir, lang)),
          ],
        ),
      ),
    ) as Record<AppLang, Library>;

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
      (_match, lang: AppLang, slug: string, anchor?: string) => {
        const page = this.libraries[lang].getPage(slug);
        const title = page.def.excerpt ? `" title="${page.def.excerpt}` : '';

        return `/pages/${lang}/${page.filename}${anchor ?? ''}${title}`;
      },
    );
  }

  /**
   * @throws Error if the file cannot be written
   */
  private async saveContent(
    renderedContents: RenderedContent[],
    lang: AppLang,
  ): Promise<void> {
    const pagesDir = join(this.outputDir, lang);
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

    const errors = blogPages
      .filter((page) => page.dateTime === undefined)
      .map((page) => page.slug);

    if (errors.length > 0) {
      throw new Error(
        `Page(s) ${errors.join(', ')} in "${library.locale.lang}" library have no date set`,
      );
    }

    return this.templatingService.render('rss-feed', {
      pages: blogPages,
      metadata: this.metadata,
      lang: library.locale.lang,
      translations: library.locale.translations,
    });
  }

  public search(
    term: string,
    lang: AppLang,
    template: string,
    limit?: number,
  ): string {
    const pages = this.libraries[lang].search(term, limit);

    return JSON.stringify(pages.map((page) => `${template}_${page.slug}.html`));
  }

  public getTag(tag: string, lang: AppLang, template: string): string {
    const pages = this.libraries[lang].tags.get(tag) ?? [];

    return JSON.stringify(pages.map((page) => `${template}_${page.slug}.html`));
  }

  /**
   * Returns a JSON string containing the URLs of all tags in the given language.
   */
  public getTags(lang: AppLang, template: string): string {
    const tags = Array.from(this.libraries[lang].tags.keys());

    return JSON.stringify(tags.map((tag) => `${template}_tag.html?tag=${tag}`));
  }
}
