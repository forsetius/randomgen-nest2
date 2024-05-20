import { Module } from '@nestjs/common';
import { CmsController } from './CmsController';
import { ContentService } from './ContentService';
import { MarkdownService } from './MarkdownService';
import { Language } from '@shared/types/Language';

@Module({
  controllers: [CmsController],
})
export class CmsModule {
  static forRoot() {
    const markdownService = new MarkdownService();

    return {
      module: CmsModule,
      providers: [
        {
          provide: 'MarkdownService',
          useConstant: markdownService,
        },
        {
          provide: 'PlContentService',
          useFactory: () => new ContentService(markdownService, Language.PL),
        },
        {
          provide: 'EnContentService',
          useFactory: () => new ContentService(markdownService, Language.EN),
        },
      ],
    };
  }
}
