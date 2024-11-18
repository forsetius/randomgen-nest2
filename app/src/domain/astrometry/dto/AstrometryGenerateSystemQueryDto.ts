import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsPositive, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class AstrometryGenerateSystemQueryDto {
  @ApiPropertyOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsOptional()
  withLife?: boolean;

  @ApiPropertyOptional()
  @IsInt()
  @IsPositive()
  @Max(3)
  @IsOptional()
  starCount?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsPositive()
  @Max(6)
  @IsOptional()
  stage?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsPositive()
  @Max(9)
  @IsOptional()
  minRockies?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsPositive()
  @Max(9)
  @IsOptional()
  maxRockies?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsPositive()
  @Max(9)
  @IsOptional()
  minGiants?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsPositive()
  @Max(9)
  @IsOptional()
  maxGiants?: number;
}
