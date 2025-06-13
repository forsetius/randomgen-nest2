import { Controller, Get, Query } from '@nestjs/common';
import type { BaseGenerator } from './generators/BaseGenerator';
import { EnglishGenerator } from './generators/EnglishGenerator';
import { PolishGenerator } from './generators/PolishGenerator';
import { Lang } from '@shared/types/Lang';
import { AppConfigService } from '@config/AppConfigService';
import { TechnobabbleRequestQueryDto } from './dto/TechnobabbleRequestQueryDto';
import { ApiOperation } from '@nestjs/swagger';
import { SourceTemplateName } from './types/SourceTemplateName';
import { BaseSource } from './types/SourceData';

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
    service: BaseGenerator<BaseSource>,
    templateName: SourceTemplateName,
    query: TechnobabbleRequestQueryDto,
  ): string[] {
    return Array(query.repeat ?? 1)
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
