import type { MarkdownRenderingProfile } from '@forsetius/glitnir-markdown';
import {
  Marked,
  type MarkedExtension,
  Renderer,
  Tokens,
  type TokenizerAndRendererExtension,
} from 'marked';
import { Lang } from '@shared/types/Lang';

export function createCmsMarkdownRenderingProfile(
  appOrigin: string,
): MarkdownRenderingProfile {
  const inlineMarkdown = new Marked({
    async: false,
    breaks: true,
    gfm: true,
  });
  const renderer = new Renderer();

  renderer.link = ({ href, title, text }: Tokens.Link) => {
    const titleAttr = title ? ` title="${title}"` : ` test="${href}"`;

    if (href.startsWith('/') || href.startsWith(appOrigin)) {
      return `<a href="${href}"${titleAttr} class="internal">${text}</a>`;
    }

    if (href === '#') {
      return `<a href="${href}"${titleAttr} class="self">${text}</a>`;
    }

    return `<a href="${href}"${titleAttr} class="external" target="_blank" rel="noopener noreferrer">${text}<i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a>`;
  };

  renderer.heading = ({ text, depth }: Tokens.Heading) => {
    const id = text.toLowerCase().replace(/\s+/g, '-');
    const level = depth.toString();
    const html = inlineMarkdown.parseInline(text) as string;

    return `<h${level} id="h${level}-${id}">${html}</h${level}>`;
  };

  return {
    renderer,
    extensions: [createSlugExtension()],
  };
}

function createSlugExtension(): MarkedExtension {
  const slugExtension: TokenizerAndRendererExtension = {
    name: 'slug',
    level: 'inline',
    start(src: string) {
      return /\[[^\]]*?]\{/.exec(src)?.index;
    },
    tokenizer(src: string) {
      const match =
        /^\[(?<text>[^\]]+?)\]\{(?<lang>en|pl)\/(?<slug>.+?)\}/u.exec(src);
      const text = match?.groups?.['text'];
      const lang = match?.groups?.['lang'];
      const slug = match?.groups?.['slug'];

      if (
        match !== null &&
        typeof text === 'string' &&
        typeof lang === 'string' &&
        typeof slug === 'string'
      ) {
        return {
          type: 'slug',
          raw: match[0],
          text,
          lang: lang as Lang,
          slug,
        } satisfies SlugToken;
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

  return {
    extensions: [slugExtension],
  };
}

interface SlugToken extends Tokens.Generic {
  readonly text: string;
  readonly lang: Lang;
  readonly slug: string;
}
