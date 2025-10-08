import { Controller, Get } from '@nestjs/common';
import type { BaseGenerator } from './generators/BaseGenerator';
import { EnglishGenerator } from './generators/EnglishGenerator';
import { PolishGenerator } from './generators/PolishGenerator';
import { Lang } from '@shared/types/Lang';
import { AppConfigService } from '@config/AppConfigService';
import {
  TechnobabbleRequestSchema,
  type TechnobabbleRequestDto,
} from './dto/TechnobabbleRequestDto';
import { ApiOperation } from '@nestjs/swagger';
import { SourceTemplateName } from './types/SourceTemplateName';
import { BaseSource } from './types/SourceData';
import { ZodSchema } from '@shared/validation/ZodSchemaDecorator';
import { ParsedArgs } from '@shared/validation/ParsedArgsDecorator';

@Controller()
export class TechnobabbleController {
  constructor(
    private polishGeneratorService: PolishGenerator,
    private englishGeneratorService: EnglishGenerator,
    private configService: AppConfigService,
  ) {}

  @ApiOperation({
    description: 'Generate raw array of Star Trek technobabble phrases',
  })
  @Get(['/technobabble', '/api/1.0/startrek/technobabble'])
  @ZodSchema((configService) => ({
    query: TechnobabbleRequestSchema(configService),
  }))
  public generateRaw(@ParsedArgs() params: TechnobabbleRequestDto): string {
    const service = this.chooseGenerator(params.lang);

    return this.generate(service, SourceTemplateName.STAR_TREK, params).join(
      '\n',
    );
  }

  private generate(
    service: BaseGenerator<BaseSource>,
    templateName: SourceTemplateName,
    query: TechnobabbleRequestDto,
  ): string[] {
    return Array(query.repeat)
      .fill(undefined)
      .map(() => service.generate(templateName));
  }

  private chooseGenerator(lang?: Lang): BaseGenerator<BaseSource> {
    const language =
      lang ?? this.configService.getInferred('app.defaultLanguage');

    return language === Lang.PL
      ? this.polishGeneratorService
      : this.englishGeneratorService;
  }
}
