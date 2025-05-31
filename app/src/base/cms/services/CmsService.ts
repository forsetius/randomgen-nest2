import fs from 'node:fs';
import fsAsync from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { Inject, Injectable } from '@nestjs/common';
import { Locale } from '@shared/types/Locale';
import { ParserService } from '../../parser/services/ParserService';
import { BlockFactory } from './BlockFactory';
import { MenuFactory } from './MenuFactory';
import { PageFactory } from './PageFactory';
import { Library } from '../domain/Library';
import { Page } from '../domain/Page';
import stopwatch from '@shared/util/stopwatch';
import { getBasename } from '@shared/util/string';
import { RenderedContent } from '../types/RenderedContent';
import { BlockType, PageDef } from '../types';
import type {
  CmsModuleOptions,
  CmsServiceOptions,
} from '../types/CmsModuleOptions';
import { CMS_OPTIONS } from '../CmsConstants';

@Injectable()
export class CmsService {
  private readonly baseSourcePath: string;
  private readonly baseOutputPath: string;
  private readonly opts: Record<Locale, CmsServiceOptions>;
  private libraries!: Record<Locale, Library>;

  public constructor(
    private readonly parserService: ParserService,
    private readonly blockFactory: BlockFactory,
    private readonly menuFactory: MenuFactory,
    private readonly pageFactory: PageFactory,
    @Inject(CMS_OPTIONS)
    options: CmsModuleOptions,
  ) {
    this.baseSourcePath = join(cwd(), 'content', 'cms');
    this.baseOutputPath = join(this.baseSourcePath, 'static');
    this.opts = Object.fromEntries(
      Object.values(Locale).map((lang) => [
        lang,
        {
          ...options,
          meta: {
            ...options.meta[lang],
            lang,
          },
        },
      ]),
    ) as Record<Locale, CmsServiceOptions>;
  }

  async onModuleInit(): Promise<void> {
    stopwatch.record('Loading CMS data...');
    await this.renderAll();
    stopwatch.record('HTML files generated');
  }

  public async renderAll(): Promise<void> {
    this.libraries = Object.fromEntries(
      await Promise.all(
        Object.values(Locale).map(
          async (lang): Promise<[Locale, Library]> => [
            lang,
            await this.render(lang),
          ],
        ),
      ),
    ) as Record<Locale, Library>;
  }

  public async render(lang: Locale): Promise<Library> {
    const [blocks, menus, pages, specialPages] = await Promise.all([
      this.blockFactory.createAll(await this.getSources(SourceDir.BLOCK, lang)),
      this.menuFactory.createAll(await this.getSources(SourceDir.MENU, lang)),
      this.pageFactory.createAll(
        await this.getSources(SourceDir.PAGE, lang),
        lang,
      ),
      this.getSources(SourceDir.SPECIAL_PAGE, lang),
    ]);
    const tagPageDef = specialPages.get('tag') as PageDef;
    const library = new Library(pages, menus, blocks, lang);
    this.addTagPages(library, tagPageDef);

    library.menus.forEach((menu) => {
      menu.render();
    });
    library.blocks.forEach((block) => {
      block.render(library);
    });

    const renderedContents: RenderedContent[] = [];
    library.pages.forEach((page) => {
      renderedContents.push(...page.render(library, this.opts[lang]));
    });
    await this.saveContent(renderedContents, lang);

    return library;
  }

  private async getSources(
    sourceDir: SourceDir,
    lang: Locale,
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

  private addTagPages(library: Library, tagPageDef: PageDef): void {
    library.addPages(
      Array.from(library.tags.keys()).map((tag) =>
        this.pageFactory.create(
          `tag-${tag}`,
          {
            ...tagPageDef,
            title: `${tagPageDef.title}: ${tag}`,
            slots: {
              bottom: [{ type: BlockType.TAG, tag }],
            },
          },
          library.lang,
        ),
      ),
    );
  }

  private async saveContent(
    renderedContents: RenderedContent[],
    lang: Locale,
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

  public search(term: string, lang: Locale): Page[] {
    return this.libraries[lang].search(term);
  }
}

enum SourceDir {
  PAGE = 'pages',
  SPECIAL_PAGE = 'specialPages',
  BLOCK = 'blocks',
  MENU = 'menus',
}

type Name = string;
