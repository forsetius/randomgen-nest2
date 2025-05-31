import { Page } from './Page';
import { ArrayMap } from '@shared/util/ArrayMap';
import { NotFoundException } from '@nestjs/common';
import { Block } from './blocks/Block';
import { Menu } from './Menu';
import { Locale } from '@shared/types/Locale';
import { Category } from './Category';

export class Library {
  public readonly pages = new Map<string, Page>();
  public readonly categories = new Map<string, Category>();
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
      this.pages.set(page.slug, page);

      // we search for the category homepages to create all the categories
      if (page.def.subcategoryName) {
        this.categories.set(
          page.slug,
          new Category(page.def.subcategoryName, page),
        );
      }

      // we can sweep for tags while doing this
      if (page.def.tags) {
        page.def.tags.forEach((tag) => {
          this.tags.add(tag, page);
        });
      }
    });

    // once we have all the categories, we can add the pages to them
    this.pages.forEach((page) => {
      if (page.def.category) {
        const category = this.categories.get(page.def.category);
        if (!category) {
          throw new Error(`Category ${page.def.category} not found`);
        }
        category.addPage(page);

        // if a page is a subcategory homepage and also has a category, it is a parent-child relationship
        if (page.def.subcategoryName) {
          const subcategory = this.categories.get(page.slug)!;
          subcategory.parent = category;
        }
      }
    });
    this.categories.forEach((category) => {
      category.sortPages();
      category.constructFullSlug();
      category.constructBreadcrumbs();
      category.getPages().forEach((page) => {
        page.category = category;
      });
    });
  }

  public getPage(slug: string): Page {
    if (!this.pages.has(slug)) {
      throw new NotFoundException(`Page ${slug} not found`);
    }

    return this.pages.get(slug)!;
  }

  public getPageRangeFromCategory(
    categorySlug: string,
    root: string,
    prev: number,
    next: number,
  ): { prev: Page[]; next: Page[] } {
    const category = this.categories.get(categorySlug);
    if (!category) {
      throw new Error(`Category ${categorySlug} not found`);
    }
    const pages = category.getPages();

    let startAt = pages.findIndex((el) => el.slug === root);
    if (startAt === -1) {
      startAt = pages.length;
    }

    return {
      prev: pages.slice(startAt - prev, startAt),
      next: pages.slice(startAt + 1, startAt + 1 + next),
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
