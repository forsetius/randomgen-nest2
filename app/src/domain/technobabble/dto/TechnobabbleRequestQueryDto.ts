import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Locale } from '@shared/types/Locale';

export class TechnobabbleRequestQueryDto {
  @IsOptional()
  @IsEnum(Locale)
  lang?: Locale;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  repeat?: number;
}
