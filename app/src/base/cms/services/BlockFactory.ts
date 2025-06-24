import { Injectable } from '@nestjs/common';
import { TemplatingService } from '@templating/TemplatingService';
import { BlockDef, BlockType, BlockZodSchema } from '../types';
import { ZodError } from 'zod';
import { SourceFileValidationException } from '../exceptions/SourceFileValidationException';
import { Block } from '../domain/blocks/Block';
import { MarkdownService } from '../../parser/services/MarkdownService';
import {
  ApiCallBlock,
  CategoryBlock,
  GalleryBlock,
  MediaBlock,
  PageSetBlock,
  StaticBlock,
  TagBlock,
} from '../domain/blocks';
import { fromZodError } from '@shared/util/fromZodError';

@Injectable()
export class BlockFactory {
  public constructor(
    private markdownService: MarkdownService,
    private templatingService: TemplatingService,
  ) {}

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
      case BlockType.CATEGORY:
        return new CategoryBlock(this.templatingService, name, def);
      case BlockType.GALLERY:
        return new GalleryBlock(this.templatingService, name, def);
      case BlockType.MEDIA:
        return new MediaBlock(this.templatingService, name, def);
      case BlockType.PAGE_SET:
        return new PageSetBlock(this.templatingService, name, def);
      case BlockType.STATIC:
        return new StaticBlock(
          this.markdownService,
          this.templatingService,
          name,
          def,
        );
      case BlockType.TAG:
        return new TagBlock(this.templatingService, name, def);
    }
  }
}
