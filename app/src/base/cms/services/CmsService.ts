import fs from 'node:fs/promises';
import path from 'node:path';
import { Injectable } from '@nestjs/common';
import { Locale } from '@shared/types/Locale';
import { ParserService } from '../../parser/services/ParserService';
import { BlockFactory } from './BlockFactory';
import { MenuFactory } from './MenuFactory';
import { PageFactory } from './PageFactory';
import { PageLib } from '../domain/PageLib';
import { Page } from '../domain/Page';
import * as process from 'node:process';
import stopwatch from '@shared/util/stopwatch';
import { BlockType, PageDef } from '../types';
import { getBasename } from '@shared/util/string';

@Injectable()
export class CmsService {
  private readonly baseSourcePath: string;
  private pages!: PageLib;

  public constructor(
    private readonly blockFactory: BlockFactory,
    private readonly menuFactory: MenuFactory,
    private readonly pageFactory: PageFactory,
    private readonly parserService: ParserService,
    private readonly locale: Locale,
  ) {
    this.baseSourcePath = path.join(process.cwd(), 'content', 'cms', locale);
  }

  async onModuleInit(): Promise<void> {
    await this.load();
  }

  public async load(): Promise<void> {
    stopwatch.record('Loading CMS data...');
    const lang = this.locale;
    const [blocks, menus, pages, specialPageDefs] = await Promise.all([
      this.blockFactory.createAll(await this.getSources(SourceDir.BLOCK), lang),
      this.menuFactory.createAll(await this.getSources(SourceDir.MENU), lang),
      this.pageFactory.createAll(await this.getSources(SourceDir.PAGE), lang),
      this.getSources(SourceDir.SPECIAL_PAGE),
    ]);
    const pageLib = new PageLib(Array.from(pages.values()));
    const tagPageDef = specialPageDefs.get(`tag`)! as Record<string, unknown>;
    for (const [tag, pages] of pageLib.tags.entries()) {
      const tagPage = this.pageFactory.create(
        `tag-${tag}`,
        {
          ...tagPageDef,
          title: `${tagPageDef['title'] as string}: ${tag}`,
          blocks: {
            pages: {
              type: BlockType.PAGE_SET,
              template: 'block-page-card-list',
              items: pages.map((page) => page.def.slug),
            },
          },
        } as unknown as PageDef,
        this.locale,
      );

      pageLib.addPage(tagPage);
    }

    menus.forEach((menu) => {
      menu.preRender();
    });
    blocks.forEach((block) => {
      block.preRender(pageLib);
    });
    pageLib.preRender(menus, blocks);

    this.pages = pageLib;
    stopwatch.record('CMS data loaded');
  }

  private async getSources(dirName: SourceDir): Promise<Map<Name, unknown>> {
    const sourcePath = path.join(this.baseSourcePath, dirName);
    const fileNames = await fs.readdir(sourcePath);
    const map: [Name, unknown][] = await Promise.all(
      fileNames
        .filter((filename: string) => this.parserService.isSupported(filename))
        .map(async (filename: string) => [
          getBasename(filename),
          await this.parserService.parseFile(path.join(sourcePath, filename)),
        ]),
    );

    return new Map<Name, unknown>(map);
  }

  public async renderPage(slug: string): Promise<string> {
    const page = this.pages.getPage(slug);

    return page.render();
  }

  public search(term: string): Page[] {
    return this.pages.search(term);
  }

  public getTag(tag: string): Page[] {
    return this.pages.getPagesByTag(tag);
  }
}

enum SourceDir {
  PAGE = 'pages',
  SPECIAL_PAGE = 'specialPages',
  BLOCK = 'blocks',
  MENU = 'menus',
}

type Name = string;
