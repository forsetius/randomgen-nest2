import { Injectable } from '@nestjs/common';
import { TemplatingService } from '@templating/TemplatingService';
import { BlockDef, BlockType, BlockZodSchema } from '../types';
import { ZodError } from 'zod';
import { SourceFileValidationException } from '../exceptions/SourceFileValidationException';
import { Locale } from '@shared/types/Locale';
import { ApiCallBlock } from '../domain/ApiCallBlock';
import { HttpService } from '@nestjs/axios';
import { Block } from '../domain/Block';
import { MarkdownService } from '../../parser/services/MarkdownService';
import { PageBlock } from '../domain/PageBlock';
import { PageListBlock } from '../domain/PageListBlock';
import { PageSetBlock } from '../domain/PageSetBlock';
import { TagBlock } from '../domain/TagBlock';
import { StaticBlock } from '../domain/StaticBlock';
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
      case BlockType.PAGE:
        return new PageBlock(this.templatingService, name, def, locale, parent);
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
      case BlockType.TAG:
        return new TagBlock(this.templatingService, name, def, locale, parent);
    }
  }
}
