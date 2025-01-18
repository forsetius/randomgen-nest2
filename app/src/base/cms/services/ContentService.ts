import fsSync from 'fs';
import path from 'path';
import YAML from 'yaml';
import { Inject, Injectable } from '@nestjs/common';
import { Locale } from '@shared/types/Locale';
import { TemplatingService } from '@templating/TemplatingService';
import { ContentLib } from '../domain';
import { MenuDef, MultiPageBlockData, PageDef } from '../types';
import type { PageFactory } from '../types';

@Injectable()
export class ContentService {
  private lib!: ContentLib;
  private baseSourcePath = path.join(__dirname, '..', '..', 'content');

  public constructor(
    private readonly templatingService: TemplatingService,
    @Inject('PageFactory')
    private readonly createPage: PageFactory,
    public readonly locale: Locale,
    private readonly metadata: Record<'meta' | 'menus', object>,
  ) {
    this.load();
  }

  public load(): void {
    const lib = new ContentLib();

    const blockDefs = this.readSourceFiles<PageDef>(SourceDirEnum.BLOCK);
    Object.entries(blockDefs).forEach(([name, def]) => {
      lib.addPage(
        `block.${name}`,
        this.createPage(`block.${name}`, def, this.locale),
      );
    });

    const menuDefs = this.readSourceFiles<MenuDef>(SourceDirEnum.MENU);
    Object.entries(menuDefs).forEach(([name, def]) => {
      lib.addMenu(name, def.name);
    });

    const pageDefs = this.readSourceFiles<PageDef>(SourceDirEnum.PAGE);
    Object.entries(pageDefs).forEach(([slug, def]) => {
      lib.addPage(slug, this.createPage(slug, def, this.locale));
    });

    lib.finalize();
    this.lib = lib;
  }

  public renderPage(slug: string): string {
    const page = this.lib.getPage(slug);
    const blocks = Object.fromEntries(
      Object.entries(page.blocks).map(([name, block]) => {
        return [
          name,
          this.templatingService.render(
            block.template,
            { ...block },
            this.locale,
          ),
        ];
      }),
    );

    return this.templatingService.render(
      page.template,
      { meta: this.metadata.meta, menus: this.lib.menus, page, blocks },
      this.locale,
    );
  }

  public search(term: string, perPage = 10, pageNo = 1): string {
    const page = this.lib.getPage('_search');
    const blocks = {
      hits: {
        name: 'hits',
        template: 'search',
        style: 'info',
        pages: this.lib.search(term, perPage, pageNo).getItems(),
      } as MultiPageBlockData,
    };

    return this.templatingService.render(
      page.template,
      { meta: this.metadata.meta, menus: this.lib.menus, page, blocks },
      this.locale,
    );
  }

  private readSourceFiles<T>(dirName: SourceDirEnum): Record<Slug, T> {
    const sourcePath = path.join(this.baseSourcePath, dirName);
    const fileNames = fsSync.readdirSync(sourcePath);

    return Object.fromEntries(
      fileNames
        .filter((filename: string) => filename.endsWith('.yaml'))
        .map((filename: string) => {
          const slug = path.basename(filename, '.yaml');
          const filePath = path.join(sourcePath, filename);
          const def = YAML.parse(
            fsSync.readFileSync(filePath, { encoding: 'utf8' }),
          ) as T;

          return [slug, def];
        }),
    );
  }
}

enum SourceDirEnum {
  PAGE = 'pages',
  BLOCK = 'blocks',
  MENU = 'menus',
}

type Slug = string;
