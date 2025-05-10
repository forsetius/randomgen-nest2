import { Injectable } from '@nestjs/common';
import { TemplatingService } from '@templating/TemplatingService';
import { BlockDef, BlockType, BlockZodSchema } from '../types';
import { ZodError } from 'zod';
import { SourceFileValidationException } from '../exceptions/SourceFileValidationException';
import { Locale } from '@shared/types/Locale';
import { ApiCallBlock } from '../domain/blocks/ApiCallBlock';
import { HttpService } from '@nestjs/axios';
import { Block } from '../domain/blocks/Block';
import { MarkdownService } from '../../parser/services/MarkdownService';
import { MediaBlock } from '../domain/blocks/MediaBlock';
import { PageListBlock } from '../domain/blocks/PageListBlock';
import { PageSetBlock } from '../domain/blocks/PageSetBlock';
import { StaticBlock } from '../domain/blocks/StaticBlock';
import { fromZodError } from '@shared/util/fromZodError';

@Injectable()
export class BlockFactory {
  public constructor(
    private httpService: HttpService,
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
    locale: Locale,
    parent?: string,
  ): Map<string, Block> {
    return new Map(
      Array.from(blockDefs).map(([source, def]) => {
        const blockDef: BlockDef = this.validate(source, def);

        return parent
          ? [source, this.create(source, blockDef, locale, parent)]
          : [source, this.createShared(source, blockDef, locale)];
      }),
    );
  }

  public createShared(
    name: string,
    def: BlockDef,
    locale: Locale,
  ): StaticBlock {
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
      locale,
      null,
    );
  }

  public create(
    name: string,
    def: BlockDef,
    locale: Locale,
    parent: string,
  ): Block {
    switch (def.type) {
      case BlockType.API_CALL:
        return new ApiCallBlock(
          this.httpService,
          this.templatingService,
          name,
          def,
          locale,
          parent,
        );
      case BlockType.MEDIA:
        return new MediaBlock(
          this.templatingService,
          name,
          def,
          locale,
          parent,
        );
      case BlockType.PAGE_LIST:
        return new PageListBlock(
          this.templatingService,
          name,
          def,
          locale,
          parent,
        );
      case BlockType.PAGE_SET:
        return new PageSetBlock(
          this.templatingService,
          name,
          def,
          locale,
          parent,
        );
      case BlockType.STATIC:
        return new StaticBlock(
          this.markdownService,
          this.templatingService,
          name,
          def,
          locale,
          parent,
        );
    }
  }
}
