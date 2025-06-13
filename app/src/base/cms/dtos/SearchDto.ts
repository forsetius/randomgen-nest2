import { Type } from 'class-transformer';
import { IsInt, Matches, Max, Min } from 'class-validator';
import { LangQueryDto } from './LangQueryDto';

export class SearchParamsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  count!: number;
}

export class SearchQueryDto extends LangQueryDto {
  @Matches(/^[\p{L}\d\s-]+$/u)
  term!: string;
}
