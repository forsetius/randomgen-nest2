import { Injectable } from '@nestjs/common';
import { marked, Tokens } from 'marked';
import { Lang } from '@shared/types/Lang';

@Injectable()
export class MarkdownService {
  public constructor() {
    marked.use({
      async: false,
      breaks: true,
      gfm: true,
      extensions: [this.preprocessSlugs(), this.columnizeText()],
    });
  }

  public parse(text: string): string {
    return marked.parse(text) as string;
  }

  public parseInline(text: string): string {
    return marked.parseInline(text) as string;
  }

  public stripMarkdown(text: string): string {
    return text.replaceAll('\n', ' ').replaceAll(/[^\p{L}\d ]*/gmu, '');
  }

  /**
   * Slug extension for marked.js
   *
   * Provides the ability to convert strings like `[Text]<en/slug>`
   * to `<a href="/pages/en/slug.html">Text</a>`
   */
  private preprocessSlugs() {
    return {
      name: 'slug',
      level: 'inline',
      start(src: string) {
        return /\[[^\]]*?]\{/.exec(src)?.index;
      },

      tokenizer(src: string) {
        const match =
          /^\[(?<text>[^\]]+?)\]\{(?<lang>en|pl)\/(?<slug>.+?)\}/u.exec(src);

        if (match?.groups) {
          return {
            type: 'slug',
            raw: match[0],
            text: match.groups['text'],
            lang: match.groups['lang'],
            slug: match.groups['slug'],
          };
        }

        return undefined;
      },
      renderer(token: Tokens.Generic) {
        if (token.type !== 'slug') {
          return '';
        }
        const slugToken = token as SlugToken;

        return `<a href="@{${slugToken.lang}/${slugToken.slug}}">${slugToken.text}</a>`;
      },
    };
  }

  /**
   * Column text extension for marked.js
   *
   * Provides the ability to convert strings like:
   * ```
   * :::columns
   * :::column
   * Content
   * :::column
   * Content
   * :::
   * ```
   * to text split into columns.
   */
  private columnizeText() {
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

interface SlugToken extends Tokens.Generic {
  text: string;
  lang: Lang;
  slug: string;
}

interface ColumnsToken extends Tokens.Generic {
  text: string;
}
