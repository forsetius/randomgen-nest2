import fs from 'node:fs';
import fsAsync from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { Injectable, Logger } from '@nestjs/common';
import { Lang } from '@shared/types/Lang';
import stopwatch from '@shared/util/stopwatch';
import { getBasename } from '@shared/util/string';
import { ParserService } from '../../parser/services/ParserService';
import { BlockFactory } from './BlockFactory';
import { MenuFactory } from './MenuFactory';
import { PageFactory } from './PageFactory';
import { Library } from '../domain/Library';
import { Locale } from '../domain/Locale';
import { RenderedContent } from '../types/RenderedContent';

@Injectable()
export class CmsService {
  private readonly baseSourcePath: string;
  private readonly baseOutputPath: string;
  private libraries!: Record<Lang, Library>;
  private readonly logger = new Logger(CmsService.name);

  public constructor(
    private readonly parserService: ParserService,
    private readonly blockFactory: BlockFactory,
    private readonly menuFactory: MenuFactory,
    private readonly pageFactory: PageFactory,
  ) {
    this.baseSourcePath = join(cwd(), 'content', 'cms');
    this.baseOutputPath = join(this.baseSourcePath, 'static');
  }

  async onModuleInit(): Promise<void> {
    stopwatch.record('Loading CMS data...');
    await this.renderAll();
    stopwatch.record('HTML files generated');
  }

  public async renderAll(): Promise<void> {
    this.libraries = Object.fromEntries(
      await Promise.all(
        Object.values(Lang).map(
          async (lang): Promise<[Lang, Library]> => [
            lang,
            await this.render(new Locale(lang)),
          ],
        ),
      ),
    ) as Record<Lang, Library>;
  }

  public async render(locale: Locale): Promise<Library> {
    const lang = locale.lang;
    const [blocks, menus, pages] = await Promise.all([
      this.blockFactory.createAll(await this.getSources(SourceDir.BLOCK, lang)),
      this.menuFactory.createAll(
        await this.getSources(SourceDir.MENU, lang),
        locale,
      ),
      this.pageFactory.createAll(
        await this.getSources(SourceDir.PAGE, lang),
        locale,
      ),
    ]);
    const library = new Library(locale, pages, menus, blocks);

    library.menus.forEach((menu) => {
      menu.render();
    });
    library.blocks.forEach((block) => {
      block.render(library);
    });

    const renderedContents = await Promise.all(
      Array.from(library.pages).map(
        async ([, page]) => await page.render(library),
      ),
    );
    await this.saveContent(renderedContents.flat(), lang);
    this.logger.debug(
      `Rendered ${library.pages.size.toString()} pages for "${lang}"`,
    );

    return library;
  }

  private async getSources(
    sourceDir: SourceDir,
    lang: Lang,
  ): Promise<Map<string, unknown>> {
    const sourcePath = join(this.baseSourcePath, lang, sourceDir);
    const fileNames = await fsAsync.readdir(sourcePath);
    const map = [
      ...fileNames
        .filter((filename: string) => this.parserService.isSupported(filename))
        .map(
          async (filename: string): Promise<[string, unknown]> => [
            getBasename(filename),
            await this.parserService.parseFile(join(sourcePath, filename)),
          ],
        ),
    ];

    return new Map<Name, unknown>(await Promise.all(map));
  }

  private async saveContent(
    renderedContents: RenderedContent[],
    lang: Lang,
  ): Promise<void> {
    const pagesDir = join(this.baseOutputPath, 'pages', lang);
    const pagesTempDir = await fsAsync.mkdtemp(`${pagesDir}-`);

    try {
      await Promise.all(
        renderedContents.map(({ filepath, content }) =>
          fsAsync.writeFile(join(pagesTempDir, filepath), content),
        ),
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

enum SourceDir {
  PAGE = 'pages',
  BLOCK = 'blocks',
  MENU = 'menus',
}

type Name = string;
