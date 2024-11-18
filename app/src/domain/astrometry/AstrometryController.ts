import { Controller, Query } from '@nestjs/common';
import { AstrometryGenerateSystemQueryDto } from './dto/AstrometryGenerateSystemQueryDto';
import { AstrometryService } from './AstrometryService';
import { AstrometryGenerateSystemRawResponseDto } from './dto/AstrometryGenerateSystemRawResponseDto';

@Controller()
export class AstrometryController {
  public constructor(private astrometryService: AstrometryService) {}

  public generateRawSystem(
    @Query() query: AstrometryGenerateSystemQueryDto,
  ): AstrometryGenerateSystemRawResponseDto {
    return this.astrometryService.generateSystem(query);
  }
}
