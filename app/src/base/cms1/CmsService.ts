import fs from 'node:fs/promises';
import path from 'node:path';
import { Injectable } from '@nestjs/common';
import { Locale } from '@shared/types/Locale';
import { ParserService } from '../parser/services/ParserService';
import { BlockFactory } from './domain/BlockFactory';
import { MenuFactory } from './domain/MenuFactory';
import { PageFactory } from './domain/PageFactory';
import { BlockDef, MenuDef, PageDef } from './types';
import { Block } from './domain/Block';
import { PageLib } from './domain/PageLib';
import { Page } from './domain/Page';

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
    this.baseSourcePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'content',
      'cms',
      locale,
    );
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

    const menus = new Map<Name, Content>(
      Array.from(menuDefs).map(([filename, def]) => {
        const menuDef: MenuDef = this.menuFactory.validate(filename, def);

        return [menuDef.name, this.menuFactory.create(menuDef, this.locale)];
      }),
    );

    const pages = new PageLib(
      Array.from(pageDefs).map(([filename, def]) => {
        const pageDef: PageDef = this.pageFactory.validate(filename, def);

        return this.pageFactory.create(filename, pageDef, this.locale);
      }),
    );

    const blocks = new Map<Name, Block>(
      Array.from(blockDefs).map(([filename, def]) => {
        const blockDef: BlockDef = this.blockFactory.validate(filename, def);

        return [blockDef.name, this.blockFactory.create(blockDef, this.locale)];
      }),
    );

    for (const [, block] of blocks) {
      block.preRender(pages);
    }
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
    if (page.dynamicBlocks.size === 0) {
      return page.content;
    }

    let content = page.content;
    for (const [id, block] of page.dynamicBlocks) {
      await block.render();

      content = content.replace(
        `<block id="${id}"></block>`,
        `<block id="${id}">${block.content}</block>`,
      );
    }

    return content;
  }

  public search(term: string): Page[] {
    return this.pages.search(term);
  }
}

enum SourceDirEnum {
  PAGE = 'pages',
  BLOCK = 'blocks',
  MENU = 'menus',
}

type Name = string;
type Content = string;
