import { Page } from './Page';
import { slugify } from '@shared/util/string';

export class Category {
  public parent: Category | undefined = undefined;
  private _fullSlug: string | undefined;
  private _breadcrumbs: string | undefined;
  private readonly pages: Page[] = [];

  get fullSlug(): string {
    if (typeof this._fullSlug === 'undefined') {
      throw new Error(
        `Full slug: category ${this.name} is not constructed yet`,
      );
    }

    return this._fullSlug;
  }

  get breadcrumbs(): string {
    if (typeof this._breadcrumbs === 'undefined') {
      throw new Error(
        `Breadcrumbs: category ${this.name} is not constructed yet`,
      );
    }

    return this._breadcrumbs;
  }

  get data(): CategoryData {
    return {
      name: this.name,
      parent: this.parent?.data,
      pages: this.pages.map((page) => page.slug),
      fullSlug: this.fullSlug,
      breadcrumbs: this.breadcrumbs,
    };
  }

  public constructor(
    public readonly name: string,
    public readonly categoryPage: Page,
  ) {}

  public constructFullSlug(): void {
    const fullSlug: string[] = [slugify(this.name)];

    let parentCategory: Category | undefined = this.parent;
    while (parentCategory) {
      fullSlug.unshift(slugify(parentCategory.name));
      parentCategory = parentCategory.parent;
    }

    this._fullSlug = fullSlug.join('_');
  }

  public constructBreadcrumbs(): void {
    const fn = (href: string, name: string) => `<a href="${href}">${name}</a>`;
    const breadcrumbs: string[] = [fn(this.categoryPage.filename, this.name)];

    let parentCategory: Category | undefined = this.parent;
    while (parentCategory) {
      breadcrumbs.unshift(
        fn(parentCategory.categoryPage.filename, parentCategory.name),
      );
      parentCategory = parentCategory.parent;
    }

    this._breadcrumbs = breadcrumbs.join(' › ');
  }

  public addPage(page: Page): void {
    this.pages.push(page);
  }

  public sortPages(): void {
    this.pages.sort((a, b) => {
      const aNumSort = a.def.sort ?? a.date?.toSeconds() ?? 0;
      const bNumSort = b.def.sort ?? b.date?.toSeconds() ?? 0;

      const numSort = aNumSort - bNumSort;

      return numSort === 0 ? a.def.title.localeCompare(b.def.title) : numSort;
    });
  }

  public getPages(): Page[] {
    return this.pages;
  }
}

interface CategoryData {
  name: string;
  parent: CategoryData | undefined;
  pages: string[];
  fullSlug: string;
  breadcrumbs: string;
}
