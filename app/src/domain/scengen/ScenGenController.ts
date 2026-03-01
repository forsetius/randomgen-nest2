import { Controller, Post } from '@nestjs/common';
import { ZodSchema } from '@shared/validation/ZodSchemaDecorator';
import { AppConfigService } from '@config/AppConfigService';
import { ParsedArgs } from '@shared/validation/ParsedArgsDecorator';
import * as Clash from '@domain/scengen/generators/scenarioPatterns/clash';
import * as Mission from '@domain/scengen/generators/scenarioPatterns/mission';

@Controller('api/scengen/1.0')
export class ScenGenController {
  public constructor(
    private clashOfInterestsGenerator: Clash.Generator,
    private missionGenerator: Mission.Generator,
  ) {}

  @Post('clash/:setting')
  @ZodSchema((configService: AppConfigService) => ({
    query: Clash.RequestSchema(configService),
  }))
  public generateClashOfInterests(
    @ParsedArgs() params: Clash.RequestDto,
  ): string {
    return this.clashOfInterestsGenerator.generate(params);
  }

  @Post('mission/:setting')
  @ZodSchema((configService: AppConfigService) => ({
    query: Mission.RequestSchema(configService),
  }))
  public generateMission(@ParsedArgs() params: Mission.RequestDto) {
    return this.missionGenerator.generate(params).toJson(params.lang);
  }
}
