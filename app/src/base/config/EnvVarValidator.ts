import {
  IsEnum,
  IsInt,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Env } from '@shared/types/Env';
import { MailProvider } from '../../io/mail/types';

const MIN_PORT_NUMBER = 0;
const MAX_PORT_NUMBER = 65535;

export class EnvVarValidator {
  @IsEnum(Env)
  ENV!: Env;

  @IsString()
  AKISMET_KEY!: string;

  @Transform(({ value }: { value: unknown }) =>
    value === '' ? undefined : value,
  )
  @IsUrl({ require_tld: false, protocols: ['http', 'https'] })
  APP_HOST!: string;

  @IsInt()
  @Min(MIN_PORT_NUMBER)
  @Max(MAX_PORT_NUMBER)
  APP_PORT!: number;

  @IsEnum(MailProvider)
  MAIL_PROVIDER?: MailProvider;

  @IsString()
  MAIL_SENDER_NAME!: string;

  @IsString()
  MAIL_SENDER_EMAIL!: string;

  @ValidateIf((o: EnvVarValidator) => o.MAIL_PROVIDER === MailProvider.SMTP)
  @IsString()
  SMTP_HOST!: string | undefined;

  @ValidateIf((o: EnvVarValidator) => o.MAIL_PROVIDER === MailProvider.SMTP)
  @IsInt()
  @Min(MIN_PORT_NUMBER)
  @Max(MAX_PORT_NUMBER)
  SMTP_PORT!: number;

  @ValidateIf((o: EnvVarValidator) => o.MAIL_PROVIDER === MailProvider.SMTP)
  @IsString()
  SMTP_USER!: string | undefined;

  @ValidateIf((o: EnvVarValidator) => o.MAIL_PROVIDER === MailProvider.SMTP)
  @IsString()
  SMTP_PASSWORD!: string | undefined;
}
