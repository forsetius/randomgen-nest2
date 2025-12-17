import { Controller, Post } from '@nestjs/common';
import { ZodSchema } from '@shared/validation/ZodSchemaDecorator';
import { AppConfigService } from '@config/AppConfigService';
import { ParsedArgs } from '@shared/validation/ParsedArgsDecorator';
import {
  type ScenGenGenerateRequestDto,
  ScenGenGenerateRequestSchema,
} from '@domain/scengen/validation/ScenGenGenerateRequestSchema';
import { ScenGenService } from '@domain/scengen/services/ScenGenService';

@Controller('api/scengen/1.0')
export class ScenGenController {
  public constructor(private scengenService: ScenGenService) {}

  @Post(':template')
  @ZodSchema((configService: AppConfigService) => ({
    query: ScenGenGenerateRequestSchema(configService),
  }))
  public generate(@ParsedArgs() params: ScenGenGenerateRequestDto): void {
    this.scengenService.generate(params);
  }
}
