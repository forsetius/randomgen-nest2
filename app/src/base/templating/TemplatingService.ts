import { Inject, Injectable } from '@nestjs/common';
import * as nunjucks from 'nunjucks';
import { DateTime } from 'luxon';
import { TEMPLATING_OPTIONS } from './TemplatingConstants';
import type { TemplatingModuleOptions } from './types/TemplatingModuleOptions';
import { InvalidTemplateException } from './exceptions/InvalidTemplateException';
import { Lang } from '@shared/types/Lang';

@Injectable()
export class TemplatingService {
  private readonly renderer: nunjucks.Environment;

  constructor(
    @Inject(TEMPLATING_OPTIONS)
    options: TemplatingModuleOptions,
  ) {
    this.renderer = nunjucks.configure(options.paths, options.options);
    this.renderer.addFilter(
      'formatDate',
      (value: DateTime, lang: Lang, format = 'yyyy-MM-dd') =>
        value.setLocale(lang).toFormat(format as string),
    );
    this.renderer.addFilter(
      'splitToColumns',
      (items: unknown, cols: string | number) => {
        if (!Array.isArray(items)) return [items];

        const n = typeof cols === 'number' ? cols : parseInt(cols, 10);
        return this.splitToColumns(items, Number.isFinite(n) ? n : 1);
      },
    );
  }

  private splitToColumns<T>(items: readonly T[], columns: number): T[][] {
    const result: T[][] = [];
    const safeColumns = Math.max(1, Math.floor(columns));
    const total = items.length;
    const base = Math.floor(total / safeColumns);
    const extra = total % safeColumns;

    let index = 0;
    for (let c = 0; c < safeColumns; c += 1) {
      const take = base + (c < extra ? 1 : 0);
      result.push(items.slice(index, index + take));
      index += take;
    }

    return result;
  }

  public render(template: string, data: Record<string, unknown>): string {
    try {
      return this.renderer.render(`${template}.njs`, data);
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }

      throw new InvalidTemplateException();
    }
  }
}
