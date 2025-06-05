import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Locale } from '@shared/types/Locale';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TechnobabbleRequestQueryDto {
  @ApiPropertyOptional({ enum: Locale })
  @IsOptional()
  @IsEnum(Locale)
  lang?: Locale;

  @ApiPropertyOptional({ enum: Locale })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  repeat?: number;
}
