import { Inject, Injectable } from '@nestjs/common';
import * as nunjucks from 'nunjucks';
import { TEMPLATING_OPTIONS } from './TemplatingConstants';
import type { TemplatingModuleOptions } from './types/TemplatingModuleOptions';
import { InvalidTemplateException } from './exceptions/InvalidTemplateException';

@Injectable()
export class TemplatingService {
  private readonly renderer: nunjucks.Environment;

  constructor(
    @Inject(TEMPLATING_OPTIONS)
    options: TemplatingModuleOptions,
  ) {
    this.renderer = nunjucks.configure(options.paths, options.options);
  }

  public render(template: string, data: Record<string, unknown>): string {
    try {
      return this.renderer.render(`${template}.njs`, data);
    } catch (e) {
      console.log(data);
      if (e instanceof Error) {
        throw e;
      }

      throw new InvalidTemplateException();
    }
  }
}
