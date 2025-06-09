import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Matches, Max, Min } from 'class-validator';
import { Locale } from '@shared/types/Locale';

export class SearchParamsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  count!: number;
}

export class SearchQueryDto {
  @Matches(/^[\p{L}\d\s-]+$/u)
  term!: string;

  @IsOptional()
  @IsEnum(Locale)
  lang: Locale = Locale.PL;
}
