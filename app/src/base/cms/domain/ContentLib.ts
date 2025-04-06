import { NotFoundException } from '@nestjs/common';
import { ArrayMap } from '@shared/util/ArrayMap';
import { Page } from './Page';
import { Pager } from './Pager';
import {
  BlockType,
  ApiCallBlockData,
  BlockData,
  MultiPageBlockData,
  SinglePageBlockData,
} from '../types';
import { MenuDef } from '../types/MenuZodSchema';
import { BlockDef } from '../types/BlockZodSchema';

export class ContentLib {
  private pages: Record<Slug, Page> = {};
  private menus: Record<Name, MenuDef> = {};
  private tags = new ArrayMap<Tag, Page>();
  private pagesByDate: Page[] = [];
  private preRenderedPages: Record<Slug, string> = {};

  public addPage(slug: string, page: Page): void {
    this.pages[slug] = page;
    page.tags.forEach((tag: Tag) => {
      this.tags.add(tag, page);
    });

    if (page.createdAt) {
      this.pagesByDate.push(page);
    }
  }

  public addMenu(name: string, menu: MenuDef): void {
    this.menus[name] = menu;
  }

  public finalize(): void {
    if (this.isFinal()) {
      return;
    }

    this.pagesByDate.sort((a, b) => a.timestamp! - b.timestamp!);
    Object.values(this.pages).forEach((page) => {
      page.blocks = Object.fromEntries(
        Object.entries(page.def.blocks ?? {}).map(([name, def]) => [
          name,
          this.renderBlock(def),
        ]),
      );
    });
  }

  private isFinal(): boolean {
    return Object.values(this.preRenderedPages).length > 0;
  }

  private renderBlock(def: BlockDef): BlockData {
    const common = {
      name: def.name,
      template: def.template,
      style: def.style,
    };
    switch (def.type) {
      case BlockType.API_CALL:
        return {
          ...common,
          url: def.url,
        } as ApiCallBlockData;
      case BlockType.PAGE:
        return {
          ...common,
          page: this.getPage(def.slug),
        } as SinglePageBlockData;
      case BlockType.PAGE_SET:
        return {
          ...common,
          pages: def.items.map((slug) => this.getPage(slug)),
        } as MultiPageBlockData;
      case BlockType.PAGE_LIST:
        return {
          ...common,
          pages: this.getPagesByDate(def.count, def.skip ?? 0),
        } as MultiPageBlockData;
    }
  }

  public getPage(slug: string): Page {
    if (!this.pages[slug]) {
      throw new NotFoundException('No such page');
    }

    return this.pages[slug];
  }

  public getPagesByDate(count: number, skip: number): Page[] {
    return this.pagesByDate.slice(skip, skip + count);
  }

  public getPagesByTag(tag: Tag, count: number, skip: number): Page[] {
    if (!this.tags.has(tag)) {
      return [];
    }

    return this.tags.get(tag)!.slice(skip, skip + count);
  }

  public getMenu(name: string): MenuDef {
    if (!this.menus[name]) {
      throw new NotFoundException('No such menu');
    }

    return this.menus[name];
  }

  public renderPage(slug: string): string {
    if (!this.pages[slug]) {
      throw new NotFoundException('No such page');
    }


  }

  public search(term: string, perPage: number, pageNo: number): Pager<Page> {
    const hits = Object.values(this.pages).filter(
      (page) =>
        page.title.toLowerCase().includes(term.toLowerCase()) ||
        !!page.subtitle?.toLowerCase().includes(term.toLowerCase()),
    );

    return new Pager<Page>(hits, perPage, pageNo);
  }
}

type Name = string;
type Slug = string;
type Tag = string;
