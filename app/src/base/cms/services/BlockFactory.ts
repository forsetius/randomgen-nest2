import type { MarkdownApi } from '@forsetius/glitnir-markdown';
import { Inject, Injectable } from '@nestjs/common';
import { TemplatingService } from '@forsetius/glitnir-templating';
import { BlockDef, BlockType, BlockZodSchema } from '../types';
import { ZodError } from 'zod';
import { SourceFileValidationException } from '../exceptions/SourceFileValidationException';
import { Block } from '../domain/blocks/Block';
import {
  ApiCallBlock,
  GalleryBlock,
  MediaBlock,
  PageGalleryBlock,
  StaticBlock,
} from '../domain/blocks';
import { CMS_MARKDOWN_API } from '../markdown/CmsMarkdownApiToken';

@Injectable()
export class BlockFactory {
  public constructor(
    @Inject(CMS_MARKDOWN_API)
    private readonly markdownApi: MarkdownApi,
    private templatingService: TemplatingService,
  ) {}

  /**
   * @throws {SourceFileValidationException}
   */
  public validate(source: string, def: unknown): BlockDef {
    try {
      return BlockZodSchema.parse(def);
    } catch (e) {
      if (e instanceof ZodError) {
        throw new SourceFileValidationException(source, e);
      }

      throw e;
    }
  }

  public createAll(blockDefs: Map<string, unknown>): Map<string, Block> {
    return new Map(
      Array.from(blockDefs).map(([source, def]) => {
        const blockDef: BlockDef = this.validate(source, def);

        return [source, this.create(source, blockDef)];
      }),
    );
  }

  public create(name: string, def: BlockDef): Block {
    switch (def.type) {
      case BlockType.API_CALL:
        return new ApiCallBlock(this.templatingService, name, def);
      case BlockType.MEDIA_GALLERY:
        return new GalleryBlock(this.templatingService, name, def);
      case BlockType.MEDIA:
        return new MediaBlock(this.templatingService, name, def);
      case BlockType.PAGE_GALLERY:
        return new PageGalleryBlock(
          this.templatingService,
          this.markdownApi,
          name,
          def,
        );
      case BlockType.STATIC:
        return new StaticBlock(
          this.templatingService,
          this.markdownApi,
          name,
          def,
        );
    }
  }
}
