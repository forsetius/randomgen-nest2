import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
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
  repeat?: number;
}
