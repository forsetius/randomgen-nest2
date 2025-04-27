import fs from 'node:fs/promises';
import path from 'node:path';
import { Injectable } from '@nestjs/common';
import { Locale } from '@shared/types/Locale';
import { ParserService } from '../../parser/services/ParserService';
import { BlockFactory } from './BlockFactory';
import { MenuFactory } from './MenuFactory';
import { PageFactory } from './PageFactory';
import { BlockDef, MenuDef, PageDef } from '../types';
import { Block } from '../domain/Block';
import { PageLib } from '../domain/PageLib';
import { Page } from '../domain/Page';
import { Menu } from '../domain/Menu';
import * as process from 'node:process';

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
    const [blockDefs, menuDefs, pageDefs] = await Promise.all([
      this.readSourceFiles(SourceDirEnum.BLOCK),
      this.readSourceFiles(SourceDirEnum.MENU),
      this.readSourceFiles(SourceDirEnum.PAGE),
    ]);

    const menus = new Map<Name, Menu>(
      Array.from(menuDefs).map(([filename, def]) => {
        const menuDef: MenuDef = this.menuFactory.validate(filename, def);
        const name = this.getName(filename);

        return [name, this.menuFactory.create(name, menuDef, this.locale)];
      }),
    );
    const pages = new PageLib(
      Array.from(pageDefs).map(([filename, def]) => {
        const pageDef: PageDef = this.pageFactory.validate(filename, def);

        return this.pageFactory.create(
          this.getName(filename),
          pageDef,
          this.locale,
        );
      }),
    );
    const blocks = new Map<Name, Block>(
      Array.from(blockDefs).map(([filename, def]) => {
        const blockDef: BlockDef = this.blockFactory.validate(filename, def);
        const name = this.getName(filename);

        return [
          name,
          this.blockFactory.createShared(name, blockDef, this.locale),
        ];
      }),
    );

    menus.forEach((menu) => {
      menu.preRender();
    });
    blocks.forEach((block) => {
      block.preRender(pages);
    });
    pages.preRender(menus, blocks);

    this.pages = pages;
  }

  private async readSourceFiles(
    dirName: SourceDirEnum,
  ): Promise<Map<Name, unknown>> {
    const sourcePath = path.join(this.baseSourcePath, dirName);
    const fileNames = await fs.readdir(sourcePath);

    const map: [Name, unknown][] = await Promise.all(
      fileNames
        .filter((filename: string) => this.parserService.isSupported(filename))
        .map(async (filename: string) => [
          filename,
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

  private getName(filename: string): string {
    return path.basename(filename, path.extname(filename));
  }
}

enum SourceDirEnum {
  PAGE = 'pages',
  BLOCK = 'blocks',
  MENU = 'menus',
}

type Name = string;
