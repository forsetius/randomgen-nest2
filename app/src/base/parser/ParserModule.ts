import { Module } from '@nestjs/common';
import { MarkdownService } from './services/MarkdownService';
import { ParserService } from './services/ParserService';
import { LoaderService } from './services/LoaderService';

@Module({
  providers: [LoaderService, MarkdownService, ParserService],
  exports: [LoaderService, MarkdownService, ParserService],
})
export class ParserModule {}
