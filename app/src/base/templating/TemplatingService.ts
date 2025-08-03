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
  }

  public render(template: string, data: Record<string, unknown>): string {
    try {
      return this.renderer.render(`${template}.njs`, data);
    } catch (e) {
      console.log(`Data passed to template ${template}:`);
      console.log(data);
      if (e instanceof Error) {
        throw e;
      }

      throw new InvalidTemplateException();
    }
  }
}
