import { Controller, Query } from '@nestjs/common';
import { AstrometryGenerator } from './AstrometryGenerator';
import { AstrometryQueryStringDto } from './dto/AstrometryQueryStringDto';
import { AstrometryGenerateSystemQueryDto } from './dto/AstrometryGenerateSystemQueryDto';

@Controller()
export class AstrometryController {
  public constructor(private generator: AstrometryGenerator) {}
  public generateSingleRaw(
    @Query() query: AstrometryQueryStringDto,
  ): AstrometrySingleRawResponseDto {
    return this.generator.generate(query.single ?? false);
  }

  public generateSystemRaw(
    @Query() query: AstrometryGenerateSystemQueryDto,
  ): AstrometrySystemRawResponseDto {
    return this.generator.generateSystem(query);
  }
}
