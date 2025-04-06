import fsSync from 'fs';
import path from 'path';
import { Inject, Injectable } from '@nestjs/common';
import { z, ZodError } from 'zod';
import { Locale } from '@shared/types/Locale';
import { TemplatingService } from '@templating/TemplatingService';
import { ContentLib } from '../domain';
import { MultiPageBlockData } from '../types';
import type { PageFactory } from '../types';
import { ParserService } from '../../parser/services/ParserService';
import { SourceFileValidationException } from '../exceptions/SourceFileValidationException';
import { BlockZodSchema } from '../types/BlockZodSchema';
import { PageZodSchema } from '../types/PageZodSchema';
import { MenuZodSchema } from '../types/MenuZodSchema';

@Injectable()
export class ContentService {
  private lib!: ContentLib;
  private preRenderedPages:;
  private baseSourcePath: string;

  public constructor(
    private readonly parserService: ParserService,
    private readonly templatingService: TemplatingService,
    @Inject('PageFactory')
    private readonly createPage: PageFactory,
    public readonly locale: Locale,
    private readonly metadata: Record<'meta' | 'menus', object>,
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

    this.load();
  }

  public load(): void {
    const lib = new ContentLib();

    const blockDefs = this.readSourceFiles(SourceDirEnum.BLOCK, BlockZodSchema);
    const menuDefs = this.readSourceFiles(SourceDirEnum.MENU, MenuZodSchema);
    const pageDefs = this.readSourceFiles(SourceDirEnum.PAGE, PageZodSchema);
    Object.entries(blockDefs).forEach(([name, def]) => {
      lib.addPage(
        `block.${name}`,
        this.createPage(`block.${name}`, def, this.locale),
      );
    });

    Object.entries(menuDefs).forEach(([name, def]) => {
      lib.addMenu(name, def);
    });

    Object.entries(pageDefs).forEach(([slug, def]) => {
      lib.addPage(slug, this.createPage(slug, def, this.locale));
    });

    lib.finalize();
    this.lib = lib;
    console.log({ lib: this.lib });
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

  private readSourceFiles<T extends z.ZodTypeAny>(
    dirName: SourceDirEnum,
    schema: T,
  ): Record<Slug, z.infer<T>> {
    const sourcePath = path.join(this.baseSourcePath, dirName);
    const fileNames = fsSync.readdirSync(sourcePath);

    return Object.fromEntries(
      fileNames
        .filter((filename: string) => this.parserService.isSupported(filename))
        .map((filename: string) => {
          const slug = path.basename(filename, path.extname(filename));
          const def = this.parserService.parseFile(
            path.join(sourcePath, filename),
          );

          try {
            return [slug, schema.parse(def) as z.infer<T>];
          } catch (e) {
            if (e instanceof ZodError) {
              throw new SourceFileValidationException(filename, e);
            }

            throw e;
          }
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
