import { Library } from '../domain/Library';
import { join } from 'node:path';
import { cwd } from 'node:process';
import fsAsync from 'node:fs/promises';
import { Lang } from '@shared/types/Lang';
import { getBasename } from '@shared/util/string';
import { Locale } from '../domain/Locale';
import { BlockFactory } from './BlockFactory';
import { MenuFactory } from './MenuFactory';
import { PageFactory } from './PageFactory';
import { ParserService } from '../../parser/services/ParserService';
import stopwatch from '@shared/util/stopwatch';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LibraryFactory {
  private readonly baseSourcePath: string;

  public constructor(
    private readonly parserService: ParserService,
    private readonly blockFactory: BlockFactory,
    private readonly menuFactory: MenuFactory,
    private readonly pageFactory: PageFactory,
  ) {
    this.baseSourcePath = join(cwd(), 'content', 'cms');
  }

  public async create(locale: Locale): Promise<Library> {
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

    stopwatch.record(
      `Created the "${lang}" library with ${library.pages.size.toString()} pages`,
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

    return new Map<string, unknown>(await Promise.all(map));
  }
}

enum SourceDir {
  PAGE = 'pages',
  BLOCK = 'blocks',
  MENU = 'menus',
}
