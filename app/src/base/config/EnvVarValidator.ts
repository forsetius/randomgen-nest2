import {
  IsEnum, IsInt,
  IsOptional,
  IsUrl, Max, Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Env } from '../../shared/types/Env';

const MIN_PORT_NUMBER = 0;
const MAX_PORT_NUMBER = 65535;

export class EnvVarValidator {
  @IsEnum(Env)
  ENV!: Env;

  @Transform(({ value }: { value: unknown }) =>
    value === '' ? undefined : value,
  )
  @IsOptional()
  @IsUrl({ require_tld: false, protocols: ['http', 'https'] })
  APP_HOST?: string;

  @IsInt()
  @Min(MIN_PORT_NUMBER)
  @Max(MAX_PORT_NUMBER)
  APP_PORT!: number;
}
