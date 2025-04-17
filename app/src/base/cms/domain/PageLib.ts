import { Page } from './Page';
import { ArrayMap } from '@shared/util/ArrayMap';
import { NotFoundException } from '@nestjs/common';
import { Block } from './Block';
import { Menu } from './Menu';

export class PageLib {
  private pages = new Map<Slug, Page>();
  private pagesByDate: Page[] = [];
  private tags = new ArrayMap<Tag, Page>();

  public constructor(pages: Page[]) {
    pages.forEach((page) => {
      this.pages.set(page.slug, page);
      page.def.tags?.forEach((tag) => {
        this.tags.add(tag, page);
      });
    });

    this.pagesByDate = pages
      .filter((page) => !(typeof page.timestamp === 'undefined'))
      .sort((a, b) => a.timestamp! - b.timestamp!);
  }

  public getPage(slug: string): Page {
    if (!this.pages.has(slug)) {
      throw new NotFoundException(`Page ${slug} not found`);
    }

    return this.pages.get(slug)!;
  }

  public getPagesByDate(count = 1, skip = 0): Page[] {
    return this.pagesByDate.slice(skip, skip + count);
  }

  public getPagesByTag(tag: Tag): Page[] {
    return this.tags.getCollection(tag);
  }

  public search(term: string): Page[] {
    return Array.from(this.pages.values()).filter(
      (page) =>
        page.searchString.includes(term.toLowerCase()) ||
        !!page.def.tags?.includes(term.toLowerCase()),
    );
  }

  public preRender(menus: Map<string, Menu>, blocks: Map<string, Block>): void {
    this.pages.forEach((page) => {
      page.preRender(menus, blocks, this);
    });
  }
}

type Slug = string;
type Tag = string;
