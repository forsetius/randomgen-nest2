import { Injectable } from '@nestjs/common';
import { TemplatingService } from '@templating/TemplatingService';
import { BlockDef, BlockType, BlockZodSchema } from '../types';
import { ZodError } from 'zod';
import { SourceFileValidationException } from '../exceptions/SourceFileValidationException';
import { Block } from '../domain/blocks/Block';
import { MarkdownService } from '../../parser/services/MarkdownService';
import {
  SeriesBlock,
  MediaBlock,
  PageListBlock,
  PageSetBlock,
  StaticBlock,
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

  public createAll(
    blockDefs: Map<string, unknown>,
    parent?: string,
  ): Map<string, Block> {
    return new Map(
      Array.from(blockDefs).map(([source, def]) => {
        const blockDef: BlockDef = this.validate(source, def);

        return parent
          ? [source, this.create(source, blockDef, parent)]
          : [source, this.createShared(source, blockDef)];
      }),
    );
  }

  public createShared(name: string, def: BlockDef): StaticBlock {
    if (def.type !== BlockType.STATIC) {
      throw new Error(
        `Shared blocks can only be static. Attempted to create ${def.type} block`,
      );
    }

    return new StaticBlock(
      this.markdownService,
      this.templatingService,
      name,
      def,
    );
  }

  public create(name: string, def: BlockDef, parent: string): Block {
    switch (def.type) {
      case BlockType.MEDIA:
        return new MediaBlock(this.templatingService, name, def);
      case BlockType.PAGE_LIST:
        return new PageListBlock(this.templatingService, name, def, parent);
      case BlockType.PAGE_SET:
        return new PageSetBlock(this.templatingService, name, def);
      case BlockType.SERIES:
        return new SeriesBlock(this.templatingService, name, def);
      case BlockType.STATIC:
        return new StaticBlock(
          this.markdownService,
          this.templatingService,
          name,
          def,
        );
    }
  }
}
