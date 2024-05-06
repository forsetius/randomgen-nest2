import { Controller, Get, Query } from '@nestjs/common';
import type { BaseGenerator } from './generators/BaseGenerator';
import { EnglishGenerator } from './generators/EnglishGenerator';
import { PolishGenerator } from './generators/PolishGenerator';
import { Language } from '@shared/types/Language';
import { AppConfigService } from '@config/AppConfigService';
import { TechnobabbleBaseDataModel } from './types/TechnobabbleBaseDataModel';
import { TechnobabbleRequestQueryDto } from './dto/TechnobabbleRequestQueryDto';
import { ApiOperation } from '@nestjs/swagger';
import { SourceTemplateName } from './types/SourceTemplateName';

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
  public generateRaw(@Query() query: TechnobabbleRequestQueryDto): string {
    const service = this.chooseGenerator(query.lang);

    return this.generate(service, SourceTemplateName.STAR_TREK, query).join(
      '\n',
    );
  }

  private generate(
    service: BaseGenerator<TechnobabbleBaseDataModel>,
    templateName: SourceTemplateName,
    query: TechnobabbleRequestQueryDto,
  ): string[] {
    return Array(query.repeat ?? 1)
      .fill(undefined)
      .map(() => service.generate(templateName));
  }

  private chooseGenerator(
    lang?: Language,
  ): BaseGenerator<TechnobabbleBaseDataModel> {
    const language =
      lang ?? this.configService.getInferred('app.defaultLanguage');

    return language === Language.PL
      ? this.polishGeneratorService
      : this.englishGeneratorService;
  }
}
