import { Injectable } from '@nestjs/common';
import { TemplatingService } from '@templating/TemplatingService';
import { BlockDef, BlockType, BlockZodSchema } from '../types';
import { ZodError } from 'zod';
import { SourceFileValidationException } from '../exceptions/SourceFileValidationException';
import { Block } from '../domain/blocks/Block';
import { MarkdownService } from '../../parser/services/MarkdownService';
import {
  ApiCallBlock,
  GalleryBlock,
  MediaBlock,
  PageGalleryBlock,
  StaticBlock,
} from '../domain/blocks';
import { fromZodError } from '@shared/util/fromZodError';

@Injectable()
export class BlockFactory {
  public constructor(
    private markdownService: MarkdownService,
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
        throw new SourceFileValidationException(source, fromZodError(e));
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
          this.markdownService,
          name,
          def,
        );
      case BlockType.STATIC:
        return new StaticBlock(
          this.templatingService,
          this.markdownService,
          name,
          def,
        );
    }
  }
}
