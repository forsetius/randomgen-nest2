import { Injectable } from '@nestjs/common';
import { marked } from 'marked';

@Injectable()
export class MarkdownService {
  public constructor() {
    marked.use({
      async: false,
      breaks: true,
      gfm: true,
    });
  }

  public parse(text: string): string {
    return marked.parse(text) as string;
  }
}
