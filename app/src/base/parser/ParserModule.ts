import { Module } from '@nestjs/common';
import { MarkdownService } from './services/MarkdownService';
import { ParserService } from './services/ParserService';

@Module({
  providers: [MarkdownService, ParserService],
  exports: [ParserService],
})
export class ParserModule {}