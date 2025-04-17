import { Inject, Injectable } from '@nestjs/common';
import * as nunjucks from 'nunjucks';
import { TEMPLATING_OPTIONS } from './TemplatingConstants';
import { Locale } from '@shared/types/Locale';
import * as TemplatingModuleOptions from './types/TemplatingModuleOptions';
import { InvalidTemplateException } from './exceptions/InvalidTemplateException';

@Injectable()
export class TemplatingService {
  private readonly renderer: nunjucks.Environment;

  constructor(
    @Inject(TEMPLATING_OPTIONS)
    options: TemplatingModuleOptions.TemplatingModuleOptions,
  ) {
    this.renderer = nunjucks.configure(options.paths, options.options);
  }

  public render(
    template: string,
    data: Record<string, unknown>,
    language: Locale,
  ): string {
    try {
      return this.renderer.render(
        `${language}/templates/${template}.njs`,
        data,
      );
    } catch (e) {
      console.log({ template, language });
      console.log(data);
      if (e instanceof Error) {
        throw e;
      }

      throw new InvalidTemplateException();
    }
  }
}
