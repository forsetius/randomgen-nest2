import { Injectable } from '@nestjs/common';
import { marked, Tokens } from 'marked';

@Injectable()
export class MarkdownService {
  public constructor() {
    marked.use({
      async: false,
      breaks: true,
      gfm: true,
      extensions: [this.getColumnsExtension()],
    });
  }

  public parse(text: string): string {
    return marked.parse(text) as string;
  }

  public stripMarkdown(text: string): string {
    return text.replaceAll('\n', ' ').replaceAll(/[^\p{L}\d ]*/gmu, '');
  }

  private getColumnsExtension() {
    return {
      name: 'columns',
      level: 'block',
      start(src: string) {
        return /:::columns/.exec(src)?.index;
      },
      tokenizer(src: string) {
        const match = /^:::columns\n([\s\S]+?)\n:::/m.exec(src);
        if (match?.[1]) {
          return {
            type: 'columns',
            raw: match[0],
            text: match[1].trim(),
          };
        }

        return undefined;
      },
      renderer(token: Tokens.Generic) {
        const columnsToken = token as ColumnsToken;
        const columns = columnsToken.text
          .split(':::column')
          .map((c) => c.trim())
          .filter(Boolean);
        const htmlColumns = columns
          .map((c) => {
            const parsed = marked.parse(c, { async: false });

            return `<div class="column">${parsed}</div>`;
          })
          .join('');

        return `<div class="columns">${htmlColumns}</div>`;
      },
    };
  }
}

interface ColumnsToken extends Tokens.Generic {
  text: string;
}
