import { Library } from '../domain/Library';
import { join } from 'node:path';
import fsAsync from 'node:fs/promises';
import { AppConfigService } from '@config/AppConfigService';
import { Lang } from '@shared/types/Lang';
import { getBasename } from '@shared/util/string';
import { Locale } from '../domain/Locale';
import { BlockFactory } from './BlockFactory';
import { MenuFactory } from './MenuFactory';
import { PageFactory } from './PageFactory';
import { ParserService } from '../../parser/services/ParserService';
import stopwatch from '@shared/util/stopwatch';
import { Injectable } from '@nestjs/common';
import { RenderingException } from '../exceptions/RenderingException';

@Injectable()
export class LibraryFactory {
  private readonly baseSourcePath: string;

  public constructor(
    private readonly parserService: ParserService,
    private readonly blockFactory: BlockFactory,
    private readonly menuFactory: MenuFactory,
    private readonly pageFactory: PageFactory,
    configService: AppConfigService,
  ) {
    this.baseSourcePath = configService.get('cms.paths.sourceDir');
  }

  public async create(locale: Locale): Promise<Library> {
    const lang = locale.lang;
    const [blockSources, menuSources, pageSources] = await Promise.all([
      this.getSources(SourceDir.BLOCK, lang),
      this.getSources(SourceDir.MENU, lang),
      this.getSources(SourceDir.PAGE, lang),
    ]);
    const blocks = this.blockFactory.createAll(blockSources);
    const menus = this.menuFactory.createAll(menuSources, locale);
    const pages = this.pageFactory.createAll(pageSources, locale);
    const library = new Library(locale, pages, menus, blocks);

    library.menus.forEach((menu) => {
      try {
        menu.render();
      } catch (e) {
        throw new RenderingException('menu', menu.name, lang, e);
      }
    });
    library.blocks.forEach((block) => {
      try {
        block.render(library);
      } catch (e) {
        throw new RenderingException('block', block.name, lang, e);
      }
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
