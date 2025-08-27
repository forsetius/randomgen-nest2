import { Page } from './Page';
import { AutoMultiMap } from '@shared/util/AutoMultiMap';
import { Block } from './blocks/Block';
import { Menu } from './Menu';
import { Category } from './Category';
import { Locale } from './Locale';
import { CategoryNotFoundException } from '../exceptions/CategoryNotFoundException';
import { PageNotFoundException } from '../exceptions/PageNotFoundException';

export class Library {
  public readonly pages = new Map<string, Page>();
  public readonly categories = new Map<string, Category>();
  public readonly tags = new AutoMultiMap<string, Page>();

  public constructor(
    public readonly locale: Locale,
    pages: Page[],
    public readonly menus: Map<string, Menu>,
    public readonly blocks: Map<string, Block>,
  ) {
    this.addPages(pages);
  }

  /**
   * @throws {CategoryNotFoundException} if the category page is not found
   */
  public addPages(pages: Page[]): void {
    pages.forEach((page) => {
      this.pages.set(page.slug, page);

      // we can sweep for tags while doing this
      page.def.tags.forEach((tag) => {
        this.tags.add(tag, page);
      });
    });

    this.pages.forEach((page) => {
      if (page.def.category) {
        if (!this.pages.has(page.def.category)) {
          throw new CategoryNotFoundException(page.slug, this.locale.lang);
        }

        const category = this.getCategory(page.def.category);
        category.addPage(page);
      }
    });

    this.categories.forEach((category) => {
      category.constructFullSlug();
      category.getPages().forEach((page) => {
        page.category = category;
      });
      category.sortPages();
    });
    this.categories.forEach((category) => {
      category.constructBreadcrumbs();
    });
  }

  private getCategory(slug: string): Category {
    if (!this.categories.has(slug)) {
      const categoryPage = this.pages.get(slug)!;
      const category = new Category(categoryPage);

      if (categoryPage.def.category) {
        category.parent = this.getCategory(categoryPage.def.category);
      }
      this.categories.set(slug, category);
    }

    return this.categories.get(slug)!;
  }

  /**
   * @throws {PageNotFoundException} if the page is not found
   */
  public getPage(slug: string): Page {
    if (!this.pages.has(slug)) {
      throw new PageNotFoundException(slug, this.locale.lang);
    }

    return this.pages.get(slug)!;
  }

  public search(term: string, maxHits?: number): Page[] {
    let pages = Array.from(this.pages.values())
      .map((page): [Page, number] => [
        page,
        page.searchString.indexOf(term.toLocaleLowerCase()),
      ])
      .filter(([, index]) => index > -1)
      .sort((a, b) => a[1] - b[1]);

    if (maxHits) {
      pages = pages.slice(0, maxHits);
    }

    return pages.map(([page]) => page);
  }
}
