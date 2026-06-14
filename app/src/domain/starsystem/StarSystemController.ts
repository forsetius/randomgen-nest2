import { Controller, Get } from '@nestjs/common';
import { ParsedArgs, ZodSchema } from '@forsetius/glitnir-validation';
import { StarSystemGenerator } from './generator/StarSystemGenerator';
import * as DTO from './dto';

@Controller()
export class StarSystemController {
  public constructor(private generator: StarSystemGenerator) {}

  @Get(['/api/1.0/starsystem'])
  @ZodSchema(({ langs }) => ({
    query: DTO.StarSystemRequestSchema({
      langs,
    }),
  }))
  public generate(
    @ParsedArgs() params: DTO.StarSystemRequestDto,
  ): DTO.StarSystemResponseDto {
    console.log(`Generating star system for ${params.lang}...`);

    return DTO.canonicalMapper(this.generator.generate());
  }

  @Get(['/api/1.0/starsystem/brief'])
  @ZodSchema(({ langs }) => ({
    query: DTO.StarSystemRequestSchema({
      langs,
    }),
  }))
  public generateBrief(
    @ParsedArgs() params: DTO.StarSystemRequestDto,
  ): DTO.BriefStarSystemResponseDto {
    console.log(`Generating brief star system for ${params.lang}...`);

    return DTO.briefMapper(this.generator.generate());
  }

  @Get(['/api/1.0/astronomenclature/name'])
  public getAstroName(): string {
    return 'Coprulu IV';
  }
}
