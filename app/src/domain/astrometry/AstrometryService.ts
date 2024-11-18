import { Injectable } from '@nestjs/common';
import { AstrometryGenerateSystemQueryDto } from './dto/AstrometryGenerateSystemQueryDto';
import { RealisticSystemGenerator } from './generators/RealisticSystemGenerator';
import { LifeBearingSystemGenerator } from './generators/LifeBearingSystemGenerator';
import { BaseSystemGenerator } from './generators/BaseSystemGenerator';
import { AstrometryGenerateSystemRawResponseDto } from './dto/AstrometryGenerateSystemRawResponseDto';

@Injectable()
export class AstrometryService {
  public constructor(
    private readonly lifeBearingSystemGenerator: LifeBearingSystemGenerator,
    private readonly realisticSystemGenerator: RealisticSystemGenerator,
  ) {}

  public generateSystem(
    optionsDto: AstrometryGenerateSystemQueryDto,
  ): AstrometryGenerateSystemRawResponseDto {
    const generator: BaseSystemGenerator = optionsDto.withLife
      ? this.lifeBearingSystemGenerator
      : this.realisticSystemGenerator;

    const timeline = generator.create(optionsDto);
    let event = timeline.getFirst();
    while (event) {
      event.value.action();
      event = event.next;
    }

    return timeline.starSystem;
  }
}
