import { NotFoundException } from '@nestjs/common';

export class Pager<T> {
  private readonly items: T[];
  private readonly pageCount: number;
  private readonly previous: number | undefined;
  private readonly next: number | undefined;

  public constructor(
    collection: T[],
    public perPage: number,
    public pageNo: number,
  ) {
    this.pageCount = Math.ceil(collection.length / perPage);
    if (pageNo > this.pageCount) {
      throw new NotFoundException('Page not found');
    }

    const start = perPage * (pageNo - 1);
    const end = start + perPage;

    this.items = collection.slice(start, end);
    this.previous = pageNo > 1 ? pageNo - 1 : undefined;
    this.next = pageNo < this.pageCount ? pageNo + 1 : undefined;
  }

  public getItems(): T[] {
    return this.items;
  }

  public getInfo() {
    return {
      pageCount: this.pageCount,
      previous: this.previous,
      next: this.next,
      perPage: this.perPage,
      pageNo: this.pageNo,
    };
  }
}
