import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Language } from '@shared/types/Language';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TechnobabbleRequestQueryDto {
  @ApiPropertyOptional({ enum: Language })
  @IsOptional()
  @IsEnum(Language)
  lang?: Language;

  @ApiPropertyOptional({ enum: Language })
  @IsOptional()
  @IsInt()
  @Min(1)
  repeat?: number;
}
