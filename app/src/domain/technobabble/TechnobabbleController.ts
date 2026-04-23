import { Controller, Get } from '@nestjs/common';
import { ParsedArgs, ZodSchema } from '@forsetius/glitnir-validation';
import type { BaseGenerator } from './generators/BaseGenerator';
import { EnglishGenerator } from './generators/EnglishGenerator';
import { PolishGenerator } from './generators/PolishGenerator';
import {
  type TechnobabbleRequestDto,
  TechnobabbleRequestSchema,
} from './dto/TechnobabbleRequestDto';
import { ApiOperation } from '@nestjs/swagger';
import { SourceTemplateName } from './types/SourceTemplateName';
import { BaseSource } from './types/SourceData';
import { DEFAULT_TECHNOBABBLE_MAX_RESULTS } from './TechnobabbleDefaults';

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
  @ZodSchema(({ langs }) => ({
    query: TechnobabbleRequestSchema({
      langs,
      maxResults: DEFAULT_TECHNOBABBLE_MAX_RESULTS,
    }),
  }))
  public generateRaw(@ParsedArgs() params: TechnobabbleRequestDto): string {
    const service =
      params.lang === 'pl'
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
