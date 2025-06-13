import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Lang } from '@shared/types/Lang';

export class TechnobabbleRequestQueryDto {
  @IsOptional()
  @IsEnum(Lang)
  lang?: Lang;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  repeat?: number;
}
