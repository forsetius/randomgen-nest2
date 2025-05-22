import { Page } from './Page';
import { ArrayMap } from '@shared/util/ArrayMap';
import { NotFoundException } from '@nestjs/common';
import { Block } from './blocks/Block';
import { Menu } from './Menu';
import { Locale } from '@shared/types/Locale';

export class Library {
  public readonly pages = new Map<string, Page>();
  public readonly series = new ArrayMap<string, Page>();
  public readonly tags = new ArrayMap<string, Page>();

  public constructor(
    pages: Page[],
    public readonly menus: Map<string, Menu>,
    public readonly blocks: Map<string, Block>,
    public readonly locale: Locale,
  ) {
    this.addPages(pages);
  }

  public addPage(page: Page): void {
    this.addPages([page]);
  }

  public addPages(pages: Page[]): void {
    pages.forEach((page) => {
      if (page.series) {
        this.series.add(page.series, page);
      }
      if (page.def.tags) {
        page.def.tags.forEach((tag) => {
          this.tags.add(tag, page);
        });
      }
    });

    // this.sort can be either a running number or a timestamp.
    // We need to convert it into running numbers
    this.series.forEach((pages) => {
      pages
        .sort((a, b) => a.sort! - b.sort!)
        .forEach((page) => {
          page.sort = pages.indexOf(page) + 1;
        });
    });

    // we add the pages to the this.pages collection last because
    // the part of this.slug is made from this.sort
    pages.forEach((page) => {
      this.pages.set(page.slug, page);
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
      console.log('Available series:', Array.from(this.series.keys()));
      throw new Error(`Series ${series} not found`);
    }

    let startAt = seriesPages.findIndex((el) => el.slug === root);
    if (startAt === -1) {
      startAt = seriesPages.length;
    }

    return {
      prev: seriesPages.slice(startAt - prev, startAt),
      next: seriesPages.slice(startAt + 1, startAt + 1 + next),
    };
  }

  public search(term: string): Page[] {
    return Array.from(this.pages.values()).filter(
      (page) =>
        page.searchString.includes(term.toLowerCase()) ||
        !!page.def.tags?.includes(term.toLowerCase()),
    );
  }
}
