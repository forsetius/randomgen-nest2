import { Injectable } from '@nestjs/common';
import { marked, Renderer, Tokens } from 'marked';
import { Lang } from '@shared/types/Lang';
import { AppConfigService } from '@config/AppConfigService';

@Injectable()
export class MarkdownService {
  public constructor(private readonly configService: AppConfigService) {
    const renderer = new Renderer();
    renderer.link = ({ href, title, text }: Tokens.Link) => {
      const titleAttr = title ? ` title="${title}"` : `test="${href}"`;

      if (
        href.startsWith('/') ||
        href.startsWith(this.configService.getInferred('app.host'))
      ) {
        return `<a href="${href}"${titleAttr} class="internal">${text}</a>`;
      } else if (href === '#') {
        return `<a href="${href}"${titleAttr} class="self">${text}</a>`;
      } else {
        return `<a href="${href}"${titleAttr} class="external" target="_blank" rel="noopener noreferrer">${text}<i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a>`;
      }
    };

    renderer.heading = ({ text, depth }: Tokens.Heading) => {
      const id = text.toLowerCase().replace(/\s+/g, '-');
      const level = depth.toString();
      const html = marked.parseInline(text) as string;
      return `<h${level} id="h${level}-${id}">${html}</h${level}>`;
    };

    marked.use({
      async: false,
      breaks: true,
      gfm: true,
      extensions: [this.preprocessSlugs()],
      renderer,
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

        return `<a class="internal" href="@{${slugToken.lang}/${slugToken.slug}}">${slugToken.text}</a>`;
      },
    };
  }
}

interface SlugToken extends Tokens.Generic {
  text: string;
  lang: Lang;
  slug: string;
}
