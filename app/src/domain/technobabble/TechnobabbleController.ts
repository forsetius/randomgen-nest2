import { Controller, Get } from '@nestjs/common';
import type { BaseGenerator } from './generators/BaseGenerator';
import { EnglishGenerator } from './generators/EnglishGenerator';
import { PolishGenerator } from './generators/PolishGenerator';
import { Lang } from '@shared/types/Lang';
import {
  type TechnobabbleRequestDto,
  TechnobabbleRequestSchema,
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
  ) {}

  @ApiOperation({
    description: 'Generate raw array of Star Trek technobabble phrases',
  })
  @Get(['/technobabble', '/api/1.0/startrek/technobabble'])
  @ZodSchema((configService) => ({
    query: TechnobabbleRequestSchema(configService),
  }))
  public generateRaw(@ParsedArgs() params: TechnobabbleRequestDto): string {
    const service =
      params.lang === Lang.PL
        ? this.polishGeneratorService
        : this.englishGeneratorService;

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
}
