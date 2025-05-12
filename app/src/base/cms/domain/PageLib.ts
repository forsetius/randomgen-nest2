import { Page } from './Page';
import { ArrayMap } from '@shared/util/ArrayMap';
import { NotFoundException } from '@nestjs/common';
import { Block } from './blocks/Block';
import { Menu } from './Menu';

export class PageLib {
  public readonly pages = new Map<string, Page>();
  public readonly series = new ArrayMap<string, Page>();
  public readonly tags = new ArrayMap<string, Page>();

  public constructor(pages: Page[]) {
    pages.forEach((page) => {
      this.addPage(page);
    });

    this.series.forEach((pages) => {
      pages.sort((a, b) => a.timestamp! - b.timestamp!);
    });
  }

  public addPage(page: Page): void {
    this.pages.set(page.def.slug, page);
    if (page.series) {
      this.series.add(page.series, page);
    }
    page.def.tags?.forEach((tag) => {
      this.tags.add(tag, page);
    });
  }

  public getPage(slug: string): Page {
    if (!this.pages.has(slug)) {
      throw new NotFoundException(`Page ${slug} not found`);
    }

    return this.pages.get(slug)!;
  }

  public getPagesFromSeries(
    series: string,
    root: string,
    prev: number,
    next: number,
  ): { prev: Page[]; next: Page[] } {
    const seriesPages = this.series.get(series);
    if (!seriesPages) {
      console.log(Array.from(this.series.keys()));
      throw new Error(`Series ${series} not found`);
    }

    let startAt = seriesPages.findIndex((el) => el.def.slug === root);
    if (startAt === -1) {
      startAt = seriesPages.length;
    }

    return {
      prev: seriesPages.slice(startAt - prev, startAt),
      next: seriesPages.slice(startAt + 1, startAt + 1 + next),
    };
  }

  public getPagesByTag(tag: string): Page[] {
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
