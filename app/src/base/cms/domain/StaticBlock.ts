import { MarkdownService } from '../../parser/services/MarkdownService';
import { BlockData } from '../types';
import { DateTime } from 'luxon';
import { Locale } from '@shared/types/Locale';
import { PageDef } from '../types/PageZodSchema';

export class Page {
  public readonly title: string;
  public readonly subtitle: string | undefined;
  public readonly lead: string | undefined;
  public readonly excerpt: string | undefined;
  public readonly content: string;
  public readonly headerImage: string | undefined;
  public readonly thumbnailImage: string | undefined;
  public readonly createdAt: string | undefined = undefined;
  public readonly timestamp: number | undefined = undefined;
  public readonly template: string;
  public readonly tags: string[];
  public blocks: Record<Name, BlockData> = {};

  public constructor(
    private readonly markdownService: MarkdownService,
    public readonly slug: string,
    public readonly def: PageDef,
    locale: Locale,
  ) {
    const createdAt = DateTime.fromFormat(
      this.slug.slice(0, 16),
      'yyyy-MM-dd_HH-mm',
    );
    if (createdAt.isValid) {
      this.createdAt = createdAt.setLocale(locale).toLocaleString();
      this.timestamp = createdAt.toMillis();
    }
    console.log({ def });
    this.title = this.def.title;
    this.subtitle = this.def.subtitle;
    this.lead = this.def.lead
      ? this.markdownService.parse(this.def.lead)
      : undefined;
    this.excerpt = this.def.excerpt ?? this.lead;
    this.content = this.markdownService.parse(this.def.content);
    this.headerImage = this.def.headerImage;
    this.thumbnailImage = this.def.thumbnailImage ?? this.def.headerImage;
    this.template = this.def.template;
    this.tags = this.def.tags ?? [];

    console.log(this);
  }
}

type Name = string;
