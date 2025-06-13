import { IsEnum, IsOptional } from 'class-validator';
import { Lang } from '@shared/types/Lang';

export class LangQueryDto {
  @IsOptional()
  @IsEnum(Lang)
  lang: Lang = Lang.PL;
}
