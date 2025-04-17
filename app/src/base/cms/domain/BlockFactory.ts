import { Injectable } from '@nestjs/common';
import { TemplatingService } from '@templating/TemplatingService';
import { BlockDef, BlockType, BlockZodSchema } from '../types';
import { ZodError } from 'zod';
import { SourceFileValidationException } from '../exceptions/SourceFileValidationException';
import { Locale } from '@shared/types/Locale';
import { ApiCallBlock } from './ApiCallBlock';
import { HttpService } from '@nestjs/axios';
import { Block } from './Block';
import { MarkdownService } from '../../parser/services/MarkdownService';
import { PageBlock } from './PageBlock';
import { PageListBlock } from './PageListBlock';
import { PageSetBlock } from './PageSetBlock';
import { TagBlock } from './TagBlock';
import { StaticBlock } from './StaticBlock';

@Injectable()
export class BlockFactory {
  public constructor(
    private httpService: HttpService,
    private markdownService: MarkdownService,
    private templatingService: TemplatingService,
  ) {}

  public validate(filename: string, def: unknown): BlockDef {
    try {
      return BlockZodSchema.parse(def);
    } catch (e) {
      if (e instanceof ZodError) {
        throw new SourceFileValidationException(filename, e);
      }

      throw e;
    }
  }

  public create(name: string, def: BlockDef, locale: Locale): Block {
    switch (def.type) {
      case BlockType.API_CALL:
        return new ApiCallBlock(
          this.httpService,
          this.templatingService,
          name,
          def,
          locale,
        );
      case BlockType.PAGE:
        return new PageBlock(this.templatingService, name, def, locale);
      case BlockType.PAGE_LIST:
        return new PageListBlock(this.templatingService, name, def, locale);
      case BlockType.PAGE_SET:
        return new PageSetBlock(this.templatingService, name, def, locale);
      case BlockType.STATIC:
        return new StaticBlock(
          this.markdownService,
          this.templatingService,
          name,
          def,
          locale,
        );
      case BlockType.TAG:
        return new TagBlock(this.templatingService, name, def, locale);
    }
  }
}
