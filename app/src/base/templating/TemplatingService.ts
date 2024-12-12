import * as fs from 'node:fs';
import { join } from 'path';
import { Inject, Injectable } from '@nestjs/common';
import * as nunjucks from 'nunjucks';
import { TEMPLATING_OPTIONS } from './TemplatingConstants';
import { AppConfigService } from '@config/AppConfigService';
import {
  TemplateDtoInterface,
  TemplatePart,
} from '@shared/types/TemplateDtoInterface';
import { Language } from '@shared/types/Language';
import * as TemplatingModuleOptions from './types/TemplatingModuleOptions';
import { LanguageNotSupportedException } from './exceptions/LanguageNotSupportedException';
import { UnknownTemplateException } from './exceptions/UnknownTemplateException';
import { InvalidTemplateException } from './exceptions/InvalidTemplateException';

@Injectable()
export class TemplatingService {
  private readonly defaultLanguage: Language;
  private readonly renderer: nunjucks.Environment;
  private readonly templates: Record<string, string[]> = {};

  constructor(
    @Inject(TEMPLATING_OPTIONS)
    options: TemplatingModuleOptions.TemplatingModuleOptions,
    configService: AppConfigService,
  ) {
    this.renderer = nunjucks.configure(options.paths, options.options);
    this.defaultLanguage = configService.getInferred('app.defaultLanguage');
    options.paths.forEach((path) => {
      fs.readdirSync(path).forEach((language) => {
        this.templates[language] = [
          ...(this.templates[language] ?? []),
          ...fs.readdirSync(join(path, language)),
        ];
      });
    });
  }

  public render(
    template: TemplateDtoInterface,
    language: Language,
  ): Record<keyof TemplatePart, string> {
    try {
      return Object.fromEntries(
        Object.entries(template.parts).map(
          ([part, templateName]: [string, string]) => {
            const renderedTemplate = this.renderer.render(
              this.getTemplateName(templateName, language),
              template.data,
            );

            return [part, renderedTemplate];
          },
        ),
      ) as Record<keyof TemplatePart, string>;
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }

      throw new InvalidTemplateException();
    }
  }

  private getTemplateName(name: string, language: Language): string {
    if (typeof this.templates[language] === 'undefined') {
      throw new LanguageNotSupportedException(language);
    }

    if (this.templates[language].includes(name)) {
      return `${language}/${name}`;
    }

    if (!this.templates[this.defaultLanguage]?.includes(name)) {
      throw new UnknownTemplateException(name);
    }

    return `${this.defaultLanguage}/${name}`;
  }
}
